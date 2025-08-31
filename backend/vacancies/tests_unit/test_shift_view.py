from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from eventos.tests_unit.utils import create_event, create_user_and_get_token
from vacancies.constants import VacancyStates
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from vacancies.models.job_types import JobType
from vacancies.models.shifts import Shift
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from datetime import date, timedelta

class ListVacancyShiftViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employee, self.token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        # Obtener modelos existentes
        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.job_type = JobType.objects.first()
        self.vacancy_state = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)

        # Asignar job_types y coordenadas al employee
        profile = self.employee.employee_profile
        profile.job_types.add(self.job_type)
        profile.latitude = 34.6037
        profile.longitude = -58.3816
        profile.save()

        # Crear evento y vacante
        self.event = create_event(owner=self.employee, category=self.category, state=self.state)
        self.vacancy = Vacancy.objects.create(
            description="Vacante test",
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )

        today = date.today()
        # Crear un shift futuro
        self.shift = Shift.objects.create(
            vacancy=self.vacancy,
            start_date=today + timedelta(days=1),
            end_date=today + timedelta(days=1),
            start_time=self.event.start_time,
            end_time=self.event.end_time,
            payment=1500.0,
            quantity=2
        )

    def test_list_vacancy_shifts_no_category(self):
        """Lista turnos sin filtro de categoría"""
        response = self.client.get(reverse("list-vacancies"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) >= 1)

    def test_list_vacancy_shifts_interests(self):
        """Filtra turnos por intereses del employee"""
        response = self.client.get(reverse("list-vacancies"), {'category': 'interests'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) >= 1)

    def test_list_vacancy_shifts_soon(self):
        """Filtra turnos por fecha más próxima"""
        response = self.client.get(reverse("list-vacancies"), {'category': 'soon'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['vacancy_id'], self.vacancy.id)

    def test_list_vacancy_shifts_nearby(self):
        """Filtra turnos por proximidad"""
        response = self.client.get(reverse("list-vacancies"), {'category': 'nearby'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) >= 1)

    def test_list_vacancy_shifts_no_category_negative(self):
        """No aparece vacante si no cumple condiciones (simulado)"""
        # Mover shift al pasado para que no aparezca
        self.shift.start_date = date.today() - timedelta(days=10)
        self.shift.save()

        response = self.client.get(reverse("list-vacancies"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) == 0)

    def test_list_vacancy_shifts_interests_negative(self):
        """Empleado sin job_types coincidentes ve todas las vacantes"""
        profile = self.employee.employee_profile
        profile.job_types.clear()
        profile.save()

        response = self.client.get(reverse("list-vacancies"), {'category': 'interests'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ahora esperamos que la vacante siga apareciendo
        self.assertTrue(len(response.data['results']) >= 1)

    def test_list_vacancy_shifts_soon_negative(self):
        """Shift en el pasado no aparece en soon"""
        self.shift.start_date = date.today() - timedelta(days=5)
        self.shift.save()

        response = self.client.get(reverse("list-vacancies"), {'category': 'soon'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) == 0)

    def test_list_vacancy_shifts_nearby_negative(self):
        """Empleado muy lejos del evento no ve vacante nearby"""
        profile = self.employee.employee_profile
        profile.latitude = 0.0
        profile.longitude = 0.0
        profile.save()

        response = self.client.get(reverse("list-vacancies"), {'category': 'nearby'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['results']) == 0)

