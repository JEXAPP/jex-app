# from django.test import TestCase
# from rest_framework.test import APIClient
# from rest_framework import status
# from django.urls import reverse
# from datetime import date, timedelta

# from eventos.models.category_events import Category
# from eventos.models.state_events import EventState
# from eventos.tests_unit.utils import create_event, create_user_and_get_token
# from vacancies.models.vacancy import Vacancy
# from vacancies.models.vacancy_state import VacancyState
# from vacancies.models.job_types import JobType
# from vacancies.constants import VacancyStates

# class SearchVacancyViewTest(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.employee, self.token = create_user_and_get_token(client=self.client, role="employee")
#         self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

#         # Modelos existentes
#         self.job_type = JobType.objects.first()
#         self.vacancy_state = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)
#         self.category = Category.objects.first()
#         self.state = EventState.objects.first()

#         # Crear evento y vacante
#         self.event = create_event(owner=self.employee, category=self.category, state=self.state)
#         self.vacancy = Vacancy.objects.create(
#             description="Vacante test",
#             event=self.event,
#             job_type=self.job_type,
#             state=self.vacancy_state
#         )

#     # --- ROLE ---
#     def test_search_by_role(self):
#         """Filtra vacantes por job_type"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'role', 'value': self.job_type.name})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertTrue(any(v['vacancy_id'] == self.vacancy.id for v in response.data['results']))

#     def test_search_by_role_negative(self):
#         """No devuelve vacantes si el rol no coincide"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'role', 'value': 'Rol inexistente'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data['results']), 0)

#     # --- EVENT ---
#     def test_search_by_event(self):
#         """Filtra vacantes por nombre de evento"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'event', 'value': 'Evento inexistente'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertTrue(any(v['vacancy_id'] == self.vacancy.id for v in response.data['results']))

#     def test_search_by_event_negative(self):
#         """No devuelve vacantes si el evento no coincide"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'event', 'value': 'Evento inexistente'})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data['results']), 0)

#     # --- DATE ---
#     def test_search_by_date_range(self):
#         """Filtra vacantes por rango de fechas"""
#         today = date.today()
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {
#             'choice': 'date',
#             'date_from': today.strftime("%d/%m/%Y"),
#             'date_to': (today + timedelta(days=5)).strftime("%d/%m/%Y")
#         })
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertTrue(any(v['vacancy_id'] == self.vacancy.id for v in response.data['results']))

#     # --- INVALID CHOICE ---
#     def test_search_invalid_choice(self):
#         """Devuelve error si choice no es válido"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'invalid'})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertIn("choice", str(response.data))

#     # --- MISSING REQUIRED VALUE ---
#     def test_search_missing_value_for_role(self):
#         """Debe devolver 400 si 'value' falta para choice='role'"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'role'})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_search_missing_value_for_event(self):
#         """Debe devolver 400 si 'value' falta para choice='event'"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'event'})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_search_missing_date_from_for_date(self):
#         """Debe devolver 400 si 'date_from' falta para choice='date'"""
#         url = reverse("search-vacancies")
#         response = self.client.get(url, {'choice': 'date'})
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
