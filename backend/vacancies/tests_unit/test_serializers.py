from django.test import TestCase
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from eventos.serializers.event import ListEventDetailSerializer, ListEventVacanciesSerializer, VacancyByEventSerializer
from eventos.tests_unit.utils import create_event
from vacancies.models.vacancy import Vacancy
from vacancies.models.job_types import JobType
from vacancies.models.vacancy_state import VacancyState
from user_auth.tests_unit.fixtures.employer_fixtures import create_employer_user
from datetime import date, time, timedelta

class ListEventDetailSerializerTests(TestCase):
    def setUp(self):
        self.user, _ = create_employer_user()
        self.category = Category.objects.first()
        self.state = EventState.objects.first()
        self.event = create_event(
            owner=self.user,
            category=self.category,
            state=self.state,
            name="Evento Test",
            description="Descripción",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            start_time=time(20,0),
            end_time=time(23,0)
        )

    def test_event_detail_serializer(self):
        serializer = ListEventDetailSerializer(self.event)
        data = serializer.data
        self.assertEqual(data["id"], self.event.id)
        self.assertEqual(data["name"], self.event.name)
        self.assertEqual(data["description"], self.event.description)
        self.assertEqual(data["location"], self.event.location)
        self.assertIn("category", data)
        self.assertEqual(data["start_date"], self.event.start_date.strftime("%d/%m/%Y"))
        self.assertEqual(data["end_date"], self.event.end_date.strftime("%d/%m/%Y"))

class VacancyByEventSerializerTests(TestCase):
    def setUp(self):
        self.user, _ = create_employer_user()
        self.job_type = JobType.objects.first()
        self.event = create_event(owner=self.user, category=Category.objects.first(), state=EventState.objects.first())
        self.vacancy_state = VacancyState.objects.first()
        self.vacancy = Vacancy.objects.create(
            event=self.event,
            job_type=self.job_type,
            description="Mozo",
            specific_job_type="Catering",
            state=self.vacancy_state  # <--- CORREGIDO
        )

    def test_vacancy_by_event_serializer(self):
        serializer = VacancyByEventSerializer(self.vacancy)
        data = serializer.data
        self.assertEqual(data["vacancy_id"], self.vacancy.id)
        self.assertEqual(data["job_type_name"], self.job_type.name)
        self.assertEqual(data["specific_job_type"], self.vacancy.specific_job_type)
        self.assertEqual(data["quantity_shifts"], 0)
        self.assertEqual(data["shift_ids"], [])

class ListEventVacanciesSerializerTests(TestCase):
    def setUp(self):
        self.user, _ = create_employer_user()
        self.event = create_event(owner=self.user, category=Category.objects.first(), state=EventState.objects.first())
        self.vacancy = Vacancy.objects.create(
            event=self.event,
            job_type=JobType.objects.first(),
            description="Mozo",
            state=VacancyState.objects.first()  # <--- CORREGIDO
        )

    def test_list_event_vacancies_serializer(self):
        serializer = ListEventVacanciesSerializer(self.event)
        data = serializer.data
        self.assertEqual(data["event_name"], self.event.name)
        self.assertEqual(len(data["vacancies"]), 1)
        self.assertEqual(data["vacancies"][0]["vacancy_id"], self.vacancy.id)
