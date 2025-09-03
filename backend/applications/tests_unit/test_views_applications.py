from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from applications.models.applications import Application
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from eventos.tests_unit.utils import create_event, create_user_and_get_token
from user_auth.models.employee import EmployeeProfile
from vacancies.constants import VacancyStates
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from vacancies.models.shifts import Shift
from vacancies.models.job_types import JobType
from vacancies.tests_unit.utils import create_vacancy_data


class ApplicationCreateViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user, self.token = create_user_and_get_token(self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Crear EmployeeProfile si no existe
        if not hasattr(self.user, "employee_profile"):
            EmployeeProfile.objects.create(user=self.user)

        self.job_type = JobType.objects.first()
        self.category = Category.objects.first() or Category.objects.create(name="Conciertos")
        self.event_state = EventState.objects.first() or EventState.objects.create(name="Publicado")
        
        # Buscar el estado Activa en la base
        self.vacancy_state = VacancyState.objects.filter(name=VacancyStates.ACTIVE.value).first()
        if not self.vacancy_state:
            self.vacancy_state = VacancyState.objects.create(name=VacancyStates.ACTIVE.value)

        # Crear evento
        self.event = create_event(
            owner=self.user,
            category=self.category,
            state=self.event_state,
            name="Concierto Test",
            description="Evento de prueba"
        )

        # Crear vacancy con estado Activa
        self.vacancy_data = create_vacancy_data(self.event, self.job_type, state=self.vacancy_state)
        self.vacancy = Vacancy.objects.create(
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state,
            description=self.vacancy_data["description"]
        )

        # Crear shift
        self.shift = Shift.objects.create(
            vacancy=self.vacancy,
            start_date=self.event.start_date,
            end_date=self.event.end_date,
            start_time=self.event.start_time,
            end_time=self.event.end_time,
            payment=1500,
            quantity=1
        )

        self.url = "/api/applications/apply/"

    def test_create_application_success(self):
        data = {"vacancy_id": self.vacancy.id, "shifts": [self.shift.id]}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)

    def test_create_application_already_applied(self):
        Application.objects.create(employee=self.user.employee_profile, shift=self.shift)
        data = {"vacancy_id": self.vacancy.id, "shifts": [self.shift.id]}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)


class ApplicationDetailViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user, self.token = create_user_and_get_token(self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')


        self.job_type = JobType.objects.first()
        self.category = Category.objects.first() or Category.objects.create(name="Conciertos")
        self.event_state = EventState.objects.first() or EventState.objects.create(name="Publicado")
        self.vacancy_state = VacancyState.objects.first() or VacancyState.objects.create(name="Abierta")

        self.event = create_event(owner=self.user, category=self.category, state=self.event_state)
        self.vacancy = Vacancy.objects.create(event=self.event, job_type=self.job_type, state=self.vacancy_state, description="Mozo")
        self.shift = Shift.objects.create(
            vacancy=self.vacancy,
            start_date=self.event.start_date,
            end_date=self.event.end_date,
            start_time=self.event.start_time,
            end_time=self.event.end_time,
            payment=1500,
            quantity=1
        )
        self.application = Application.objects.create(employee=self.user.employee_profile, shift=self.shift)
        self.url = f"/api/applications/apply/{self.application.id}/detail/"

    def test_application_detail_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data["payment"]), float(self.shift.payment))
        self.assertEqual(response.data["start_date"], self.shift.start_date.strftime("%d/%m/%Y"))
        self.assertEqual(response.data["end_date"], self.shift.end_date.strftime("%d/%m/%Y"))
    
    def test_application_detail_not_found(self):
        response = self.client.get("/api/applications/apply/9999/detail/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ListApplicationsByShiftViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer_user, self.token = create_user_and_get_token(self.client, role="employer")
        self.application_user, _ = create_user_and_get_token(self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')


        self.job_type = JobType.objects.first()
        self.category = Category.objects.first() or Category.objects.create(name="Conciertos")
        self.event_state = EventState.objects.first() or EventState.objects.create(name="Publicado")
        self.vacancy_state = VacancyState.objects.first() or VacancyState.objects.create(name="Abierta")

        self.event = create_event(owner=self.employer_user, category=self.category, state=self.event_state)
        self.vacancy = Vacancy.objects.create(event=self.event, job_type=self.job_type, state=self.vacancy_state, description="Mozo")
        self.shift = Shift.objects.create(
            vacancy=self.vacancy,
            start_date=self.event.start_date,
            end_date=self.event.end_date,
            start_time=self.event.start_time,
            end_time=self.event.end_time,
            payment=1500,
            quantity=1
        )
        self.application = Application.objects.create(employee=self.application_user.employee_profile, shift=self.shift)
        self.url = f"/api/applications/by-vacancy/{self.vacancy.id}/shift/{self.shift.id}/"

    def test_list_applications_by_shift_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("applications", response.data)
        self.assertEqual(len(response.data["applications"]), 1)

    def test_list_applications_by_shift_vacancy_not_found(self):
        response = self.client.get(f"/api/applications/by-vacancy/9999/shift/{self.shift.id}/")
        self.assertEqual(response.status_code, 404)

    def test_list_applications_by_shift_shift_not_found(self):
        response = self.client.get(f"/api/applications/by-vacancy/{self.vacancy.id}/shift/9999/")
        self.assertEqual(response.status_code, 404)
