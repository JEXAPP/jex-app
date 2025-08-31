from rest_framework import serializers
from eventos.errors.events_messages import EVENT_START_DATE_AFTER_END_DATE, EVENT_START_TIME_NOT_BEFORE_END_TIME, EVENT_START_DATE_IN_PAST, INVALID_STATE_ID
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.constants import EventStates
from eventos.serializers.category_events import ListCategorySerializer
from eventos.serializers.state_events import EventStateSerializer
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from media_utils.serializers import ImageSerializer
from user_auth.models.user import CustomUser
from datetime import date
from vacancies.models.vacancy import Vacancy


class CreateEventSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date', 
            'start_time', 'end_time', 'location', 'created_at', 
            'updated_at', 'category_id', 'latitude', 'longitude'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def validate(self, data):
        self._validate_dates(data)
        self._validate_start_date_future(data)
        return data

    def _validate_dates(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(EVENT_START_DATE_AFTER_END_DATE)

        # si es el mismo día, start_time debe ser menor que end_time
        if start_date == end_date and start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(EVENT_START_TIME_NOT_BEFORE_END_TIME)

    def _validate_start_date_future(self, data):
        start_date = data.get('start_date')
        if start_date and start_date < date.today():
            raise serializers.ValidationError(EVENT_START_DATE_IN_PAST)

    def create(self, validated_data):
        user = self.context['user']
        public_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
        validated_data['owner'] = user
        validated_data['state'] = public_state
        return Event.objects.create(**validated_data)

   
class CreateEventResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'description']
    

class EventOwnerSerializer(serializers.ModelSerializer):
    profile_image = ImageSerializer(allow_null=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'full_name', 'email', 'profile_image']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class EventSerializer(serializers.ModelSerializer):
    owner = EventOwnerSerializer()
    category = ListCategorySerializer()
    state = EventStateSerializer()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'owner', 'category', 'state']

class ListActiveEventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name']

class ListEventsByEmployerSerializer(serializers.ModelSerializer):
    
    state = EventStateSerializer()
    class Meta:
        model = Event
        fields = ['id', 'name', 'state']


class ListEventDetailSerializer(serializers.ModelSerializer):

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    category = ListCategorySerializer()

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "description",
            "location",
            "latitude",
            "longitude",
            "category",
            "start_date",
            "start_time",
            "end_date",
            "end_time",
        ]


class VacancyByEventSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source="id")
    job_type_name = serializers.CharField(source="job_type.name")
    quantity_shifts = serializers.SerializerMethodField()
    shift_ids = serializers.SerializerMethodField()


    class Meta:
        model = Vacancy
        fields = [
            "vacancy_id",
            "job_type_name",
            "specific_job_type",
            "quantity_shifts",
            "shift_ids"
        ]

    def get_quantity_shifts(self, obj):
        return obj.shifts.count()
    
    def get_shift_ids(self, obj):
        return list(obj.shifts.values_list("id", flat=True))

class ListEventVacanciesSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source="name")
    vacancies = VacancyByEventSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ["event_name", "vacancies"]

class UpdateEventStateSerializer(serializers.Serializer):
    state_id = serializers.IntegerField()

    def validate_state_id(self, value):
        if not EventState.objects.filter(id=value).exists():
            raise serializers.ValidationError(INVALID_STATE_ID)
        return value




    