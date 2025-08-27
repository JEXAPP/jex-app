from django.test import TestCase
from datetime import date, timedelta, time

from eventos.errors.events_messages import EVENT_START_DATE_AFTER_END_DATE, EVENT_START_DATE_IN_PAST, EVENT_START_TIME_NOT_BEFORE_END_TIME
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from eventos.serializers.event import (
    CreateEventSerializer,
    CreateEventResponseSerializer,
    EventOwnerSerializer,
    ListActiveEventsSerializer,
    ListEventDetailSerializer,
    ListEventVacanciesSerializer,
)
from vacancies.constants import VacancyStates
from vacancies.models.vacancy import Vacancy
from user_auth.tests_unit.fixtures.employee_fixtures import create_employee_user
from eventos.tests_unit.utils import create_event
from vacancies.models.vacancy_state import VacancyState


class CreateEventSerializerTest(TestCase):

    def setUp(self):
        # Crear usuario único para este test
        self.user = create_employee_user(email="employee1@test.com")
        # Asegurar categoría y estado
        self.category = Category.objects.first() or Category.objects.create(name="Test Category")
        self.state = EventState.objects.first() or EventState.objects.create(name="Published")

        self.valid_data = {
            "name": "Evento Serializer",
            "description": "Descripción",
            "start_date": date.today() + timedelta(days=1),
            "end_date": date.today() + timedelta(days=2),
            "start_time": time(10, 0),
            "end_time": time(18, 0),
            "location": "Ciudad",
            "category_id": self.category.id,
            "latitude": 34.6037,
            "longitude": -58.3816,
        }

    def test_valid_data_creates_event(self):
        serializer = CreateEventSerializer(data=self.valid_data, context={"user": self.user})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        event = serializer.save()
        self.assertEqual(event.owner, self.user)
        self.assertEqual(event.name, self.valid_data["name"])

    def test_missing_latitude_or_longitude(self):
        data = self.valid_data.copy()
        data.pop("latitude")
        serializer = CreateEventSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn("latitude", serializer.errors)

        data = self.valid_data.copy()
        data.pop("longitude")
        serializer = CreateEventSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn("longitude", serializer.errors)

    def test_start_date_after_end_date_raises(self):
        data = self.valid_data.copy()
        data["start_date"] = date.today() + timedelta(days=3)
        data["end_date"] = date.today() + timedelta(days=2)
        serializer = CreateEventSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn(EVENT_START_DATE_AFTER_END_DATE, serializer.errors)

    def test_start_time_not_before_end_time_raises(self):
        data = self.valid_data.copy()
        same_day = date.today() + timedelta(days=1)
        data["start_date"] = same_day
        data["end_date"] = same_day
        data["start_time"] = time(18, 0)
        data["end_time"] = time(10, 0)
        serializer = CreateEventSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn(EVENT_START_TIME_NOT_BEFORE_END_TIME, serializer.errors)

    def test_start_date_in_past_raises(self):
        data = self.valid_data.copy()
        data["start_date"] = date.today() - timedelta(days=1)
        serializer = CreateEventSerializer(data=data, context={"user": self.user})
        self.assertFalse(serializer.is_valid())
        self.assertIn(EVENT_START_DATE_IN_PAST, serializer.errors)


class EventSerializersTest(TestCase):

    def setUp(self):
        # Usuario único para este test
        self.user = create_employee_user(email="employee2@test.com")
        # Categoría y estado asegurados
        self.category = Category.objects.first() or Category.objects.create(name="Test Category")
        self.state = EventState.objects.first() or EventState.objects.create(name="Published")
        # Evento de prueba
        self.event = create_event(owner=self.user, category=self.category, state=self.state)

    def test_create_event_response_serializer(self):
        serializer = CreateEventResponseSerializer(self.event)
        self.assertEqual(serializer.data["id"], self.event.id)
        self.assertEqual(serializer.data["description"], self.event.description)

    def test_event_owner_serializer_full_name(self):
        serializer = EventOwnerSerializer(self.user)
        expected_name = f"{self.user.first_name} {self.user.last_name}".strip()
        self.assertEqual(serializer.data["full_name"], expected_name)

    def test_list_active_events_serializer(self):
        serializer = ListActiveEventsSerializer(self.event)
        self.assertEqual(serializer.data["id"], self.event.id)
        self.assertEqual(serializer.data["name"], self.event.name)

    def test_list_event_detail_serializer_fields(self):
        serializer = ListEventDetailSerializer(self.event)
        self.assertEqual(serializer.data["id"], self.event.id)
        self.assertEqual(serializer.data["category"]["id"], self.category.id)

    def test_list_event_vacancies_serializer(self):
        active_state, _ = VacancyState.objects.get_or_create(name=VacancyStates.ACTIVE.value)

        vacancy = Vacancy.objects.create(
            event=self.event,
            state=active_state,
            job_type_id=1,
        )
        serializer = ListEventVacanciesSerializer(self.event)
        self.assertEqual(serializer.data["event_name"], self.event.name)
        self.assertEqual(len(serializer.data["vacancies"]), 1)
        self.assertEqual(serializer.data["vacancies"][0]["vacancy_id"], vacancy.id)
