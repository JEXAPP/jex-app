from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from applications.models.offers import Offer
from applications.models.offer_state import OfferState
from applications.constants import OfferStates
from applications.tests_unit.utils import create_application_with_shift
from eventos.tests_unit.utils import create_user_and_get_token
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from vacancies.models.vacancy_state import VacancyState
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from vacancies.models.job_types import JobType

from django.urls import reverse

class OfferViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer_user, self.employer_token = create_user_and_get_token(self.client, role="employer")
        self.employee_user, self.employee_token = create_user_and_get_token(self.client, role="employee")
        
        # Crear perfiles si no existen
        if not hasattr(self.employee_user, "employee_profile"):
            EmployeeProfile.objects.create(user=self.employee_user)
        if not hasattr(self.employer_user, "employer_profile"):
            EmployerProfile.objects.create(user=self.employer_user)

        # Estados
        self.vacancy_state = VacancyState.objects.filter(name="Activa").first()
        if not self.vacancy_state:
            self.vacancy_state = VacancyState.objects.create(name="Activa")
        self.category = Category.objects.first() or Category.objects.create(name="Conciertos")
        self.event_state = EventState.objects.first() or EventState.objects.create(name="Publicado")
        self.job_type = JobType.objects.first()

        # Crear Application con shift y vacancy
        self.application, self.shift, self.vacancy, self.event = create_application_with_shift(
            employee=self.employee_user,
            employer=self.employer_user,
            vacancy_state=self.vacancy_state,
            job_type=self.job_type,
            category=self.category,
            event_state=self.event_state
        )

        # Estado Offer pendiente
        self.offer_state_pending = OfferState.objects.filter(name=OfferStates.PENDING.value).first()
        if not self.offer_state_pending:
            self.offer_state_pending = OfferState.objects.create(name=OfferStates.PENDING.value)

    def test_create_offer_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employer_token}')
        url = reverse('offer-create', kwargs={'application_id': self.application.id})
        data = {"additional_comments": "Oferta de prueba"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)

    def test_employee_can_list_pending_offers(self):
        offer = Offer.objects.create(
            application=self.application,
            employee=self.employee_user.employee_profile,
            employer=self.employer_user.employer_profile,
            state=self.offer_state_pending
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employee_token}')
        url = reverse('offer-consult')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)

    def test_offer_detail_view(self):
        offer = Offer.objects.create(
            application=self.application,
            employee=self.employee_user.employee_profile,
            employer=self.employer_user.employer_profile,
            state=self.offer_state_pending
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employee_token}')
        url = reverse('offer-detail', kwargs={'pk': offer.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_employee_can_decide_offer(self):
        # Oferta para aceptar
        offer_accept = Offer.objects.create(
            application=self.application,
            employer=self.employer_user.employer_profile,
            employee=self.employee_user.employee_profile,
            state=self.offer_state_pending,
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employee_token}')
        url_accept = reverse('offer-decision', kwargs={'offer_id': offer_accept.id})
        data_accept = {"rejected": False}
        response = self.client.post(url_accept, data_accept, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

        # Oferta para rechazar
        offer_reject = Offer.objects.create(
            application=self.application,
            employer=self.employer_user.employer_profile,
            employee=self.employee_user.employee_profile,
            state=self.offer_state_pending,
        )
        url_reject = reverse('offer-decision', kwargs={'offer_id': offer_reject.id})
        data_reject = {"rejected": True, "rejection_reason": "No puedo asistir"}
        response = self.client.post(url_reject, data_reject, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

