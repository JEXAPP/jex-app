from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from eventos.tests_unit.utils import create_event, create_user_and_get_token
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from vacancies.models.job_types import JobType
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from datetime import timedelta, date, time

from vacancies.tests_unit.utils import create_vacancy_data

class CreateVacancyViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer, self.token = create_user_and_get_token(client=self.client, role="employer")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.event = create_event(owner=self.employer, category=self.category, state=self.state)
        self.vacancy_state = VacancyState.objects.first()
        self.job_type = JobType.objects.first()

        # Datos dinámicos
        self.vacancy_data = create_vacancy_data(
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )

    def test_create_vacancy_with_shifts_and_requirements(self):
        """Creación exitosa de vacante con turnos y requerimientos"""
        url = reverse("create-vacancy")
        response = self.client.post(url, self.vacancy_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        vacancy = Vacancy.objects.get(description=self.vacancy_data["description"])
        self.assertEqual(vacancy.shifts.count(), len(self.vacancy_data["shifts"]))
        self.assertEqual(vacancy.requirements.count(), len(self.vacancy_data["requirements"]))

    def test_create_vacancy_invalid_shifts(self):
        """Error si los turnos están fuera de fechas del evento"""
        invalid_data = create_vacancy_data(
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )
        future_date = (self.event.end_date + timedelta(days=1)).strftime("%d/%m/%Y")
        invalid_data["shifts"][0]["start_date"] = future_date
        invalid_data["shifts"][0]["end_date"] = future_date

        url = reverse("create-vacancy")
        response = self.client.post(url, invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("dentro del evento", str(response.data))

    def test_create_vacancy_forbidden_employee(self):
        """Un employee no puede crear vacantes"""
        employee, employee_token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {employee_token}")
        url = reverse("create-vacancy")
        response = self.client.post(url, self.vacancy_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UpdateVacancyViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer, self.token = create_user_and_get_token(client=self.client, role="employer")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.event = create_event(owner=self.employer, category=self.category, state=self.state)
        self.vacancy_state = VacancyState.objects.first()
        self.job_type = JobType.objects.first()

        self.vacancy_data = create_vacancy_data(
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )
        # Creamos la vacante inicial
        self.vacancy = Vacancy.objects.create(
            description=self.vacancy_data["description"],
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )

    def test_update_vacancy_success(self):
        """Actualización exitosa de vacante"""
        url = reverse("edit-vacancy", kwargs={"pk": self.vacancy.id})
        updated_data = self.vacancy_data.copy()
        updated_data["description"] = "Camarero actualizado"
        
        response = self.client.put(url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vacancy.refresh_from_db()
        self.assertEqual(self.vacancy.description, "Camarero actualizado")

    def test_update_vacancy_forbidden_employee(self):
        """Un employee no puede actualizar vacantes"""
        employee, employee_token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {employee_token}")
        url = reverse("edit-vacancy", kwargs={"pk": self.vacancy.id})
        updated_data = self.vacancy_data.copy()
        updated_data["description"] = "Intento no permitido"

        response = self.client.put(url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_vacancy_invalid_data(self):
        """Error si se envían datos inválidos"""
        url = reverse("edit-vacancy", kwargs={"pk": self.vacancy.id})
        invalid_data = self.vacancy_data.copy()
        invalid_data["description"] = ""  # Campo requerido vacío

        response = self.client.put(url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verifica que el mensaje de error menciona que el campo no puede estar vacío
        self.assertIn("may not be blank", str(response.data))


class VacancyDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employee, self.token = create_user_and_get_token(client=self.client, role="employee")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.event = create_event(owner=self.employee, category=self.category, state=self.state)
        self.vacancy_state = VacancyState.objects.first()
        self.job_type = JobType.objects.first()

        # Crear vacante
        self.vacancy = Vacancy.objects.create(
            description="Vacante de prueba detalle",
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )

    def test_get_vacancy_detail_success(self):
        """Un usuario autenticado obtiene el detalle de una vacante existente"""
        url = reverse("get-vacancy", kwargs={"pk": self.vacancy.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.vacancy.id)
        self.assertEqual(response.data["description"], self.vacancy.description)

    def test_get_vacancy_detail_not_found(self):
        """Devuelve 404 si la vacante no existe"""
        url = reverse("get-vacancy", kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("vacante no encontrada", str(response.data).lower())

    def test_get_vacancy_detail_unauthenticated(self):
        """Devuelve 401 si no hay autenticación"""
        self.client.credentials()  # Quitar el token
        url = reverse("get-vacancy", kwargs={"pk": self.vacancy.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EmployerEventsWithVacanciesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer, self.token = create_user_and_get_token(client=self.client, role="employer")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.event = create_event(owner=self.employer, category=self.category, state=self.state)
        self.vacancy_state = VacancyState.objects.first()
        self.job_type = JobType.objects.first()

        self.vacancy_data = create_vacancy_data(
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )
        # Creamos la vacante inicial
        self.vacancy = Vacancy.objects.create(
            description=self.vacancy_data["description"],
            event=self.event,
            job_type=self.job_type,
            state=self.vacancy_state
        )

        # Employer sin evento
        self.empty_employer, self.empty_token = create_user_and_get_token(client=self.client, role="employer")

        # Employee sin permisos
        self.employee, self.employee_token = create_user_and_get_token(client=self.client, role="employee")

        self.url = reverse("vacantes-por-evento")
        
    # def test_employer_can_list_events_with_vacancies(self):
    #     """El employer puede listar sus eventos con vacantes"""
    #     self.employer.refresh_from_db()
    #     response = self.client.get(self.url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1)
    #     self.assertEqual(response.data[0]["id"], self.event.id)
    #     self.assertEqual(response.data[0]["vacancies"][0]["id"], self.vacancy.id)
        # ARREGLAR CUANDO SE PRUEBE EL ENDPOINT

    def test_employer_without_events_returns_empty_list(self):
        """Employer sin eventos obtiene lista vacía"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.empty_token}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


    def test_employee_cannot_access_events_with_vacancies(self):
        """Un employee no puede acceder a esta vista"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.employee_token}")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_user_cannot_access_events_with_vacancies(self):
        """Un usuario no autenticado no puede acceder"""
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)