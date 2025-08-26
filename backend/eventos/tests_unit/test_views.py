from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from eventos.constants import EventStates
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from vacancies.constants import VacancyStates
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from eventos.tests_unit.utils import create_user_and_get_token, create_event


class BaseEventTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Usuario genérico employee para tests de solo lectura
        self.user, self.token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.category = Category.objects.first()
        self.state = EventState.objects.first()


class ListActiveEventsViewTest(BaseEventTest):
    def setUp(self):
        super().setUp()
        self.url = reverse("list-active-events")
        # Crear un usuario con rol EMPLOYEE para poder listar eventos
        self.employee, self.employee_token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.employee_token}")

    def test_list_active_events(self):
        # Obtener estado publicado
        published_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
        
        # Crear un evento publicado
        event = create_event(owner=self.employee, category=self.category, state=published_state)
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(e["id"] == event.id for e in response.data))


class DeleteEventViewTest(BaseEventTest):
    def setUp(self):
        super().setUp()
        # Usuario employer para crear y borrar eventos
        self.employer, self.employer_token = create_user_and_get_token(
            client=self.client, role="employer", email="employer@test.com"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.employer_token}")

    def test_delete_event_by_owner(self):
        event = create_event(owner=self.employer, category=self.category, state=self.state)
        url = reverse("delete-event", kwargs={"pk": event.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=event.id).exists())

    def test_delete_event_forbidden(self):
        other_employer, other_token = create_user_and_get_token(
            client=self.client, role="employer", email="other@test.com"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {other_token}")
        event = create_event(owner=self.employer, category=self.category, state=self.state)
        url = reverse("delete-event", kwargs={"pk": event.id})
        response = self.client.delete(url)

        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

class ListEventDetailViewTest(BaseEventTest):
    def setUp(self):
        super().setUp()
        # Crear un usuario con rol EMPLOYER para tener permisos
        self.employer, self.employer_token = create_user_and_get_token(client=self.client, role="employer")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.employer_token}")

    def test_retrieve_event_detail(self):
        event = create_event(owner=self.employer, category=self.category, state=self.state)
        url = reverse("detail-event", kwargs={"pk": event.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], event.id)


def test_update_event(self):
    event = create_event(owner=self.employer, category=self.category, state=self.state)
    url = reverse("update-event", kwargs={"pk": event.id})
    
    payload = {
        "name": "Evento Actualizado",
        "description": "Nueva descripción",
        "category_id": self.category.id,
        "start_date": event.start_date.strftime("%Y-%m-%d"),
        "end_date": event.end_date.strftime("%Y-%m-%d"),
        "start_time": event.start_time.strftime("%H:%M:%S"),
        "end_time": event.end_time.strftime("%H:%M:%S"),
        "location": event.location,
        "latitude": event.latitude,
        "longitude": event.longitude
    }
    
    response = self.client.patch(url, payload, format="json")
    self.assertEqual(response.status_code, 200, response.data)
    event.refresh_from_db()
    self.assertEqual(event.name, "Evento Actualizado")
    self.assertEqual(event.description, "Nueva descripción")
    

class ListEventVacanciesViewTest(BaseEventTest):
    def setUp(self):
        super().setUp()
        # Usuario employer para crear evento
        self.employer, self.employer_token = create_user_and_get_token(
            client=self.client, role="employer", email="employer@test.com"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.employer_token}")

    def test_list_event_vacancies(self):
        # Crear evento publicado
        published_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
        event = create_event(owner=self.employer, category=self.category, state=published_state)

        # Crear vacante activa
        active_state, _ = VacancyState.objects.get_or_create(name=VacancyStates.ACTIVE.value)
        Vacancy.objects.create(
            event=event,
            state=active_state,
            job_type_id=1,
        )

        url = reverse("event-vacancies", kwargs={"pk": event.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("vacancies", response.data)
        self.assertEqual(len(response.data["vacancies"]), 1)