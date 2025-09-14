from rest_framework import serializers
from applications.utils import get_job_type_display
from eventos.errors.events_messages import BOTH_PROFILE_IMAGE_FIELDS_REQUIRED, EVENT_START_DATE_AFTER_END_DATE, EVENT_START_TIME_NOT_BEFORE_END_TIME, EVENT_START_DATE_IN_PAST, INVALID_STATE_ID
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.constants import EventStates
from eventos.serializers.category_events import ListCategorySerializer
from eventos.serializers.state_events import EventStateSerializer
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from media_utils.models import Image, ImageType
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
    profile_image_url = serializers.CharField(allow_null=True, required=False)
    profile_image_id = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date',
            'start_time', 'end_time', 'location', 'created_at',
            'updated_at', 'category_id', 'latitude', 'longitude',
            'profile_image_url', 'profile_image_id',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def validate(self, data):
        self._validate_dates(data)
        self._validate_start_date_future(data)
        self._validate_image_fields(data)
        return data

    def _validate_dates(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(EVENT_START_DATE_AFTER_END_DATE)

        if start_date == end_date and start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(EVENT_START_TIME_NOT_BEFORE_END_TIME)

    def _validate_start_date_future(self, data):
        start_date = data.get('start_date')
        if start_date and start_date < date.today():
            raise serializers.ValidationError(EVENT_START_DATE_IN_PAST)

    def _validate_image_fields(self, data):
        profile_image_url = data.get('profile_image_url')
        profile_image_id = data.get('profile_image_id')

        if not profile_image_url or not profile_image_id:
            raise serializers.ValidationError(BOTH_PROFILE_IMAGE_FIELDS_REQUIRED)

    def create(self, validated_data):
        user = self.context['user']

        image_url = validated_data.pop('profile_image_url', None)
        image_id = validated_data.pop('profile_image_id', None)

        image_obj = None
        if image_url and image_id:
            image_obj, _ = Image.objects.update_or_create(
                public_id=image_id,
                defaults={
                    'url': image_url,
                    'type': ImageType.EVENT,
                    'uploaded_by': user,
                }
            )

        public_state = EventState.objects.get(name=EventStates.PUBLISHED.value)

        validated_data['owner'] = user
        validated_data['state'] = public_state
        if image_obj:
            validated_data['event_image'] = image_obj

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
    event_image_public_id = serializers.CharField(
        source="event_image.public_id", read_only=True
    )
    event_image_url = serializers.CharField(
        source="event_image.url", read_only=True
    )

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'owner', 'category', 'state', 'event_image_public_id', 'event_image_url']

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
    event_image_url = serializers.SerializerMethodField()
    event_image_public_id = serializers.SerializerMethodField()

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
            "event_image_url",
            "event_image_public_id",
        ]

    def get_event_image_url(self, obj):
        if obj.event_image:
            return obj.event_image.url
        return None

    def get_event_image_public_id(self, obj):
        if obj.event_image:
            return obj.event_image.public_id
        return None


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
    
class VacancyEventSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source='id')
    job_type_name = serializers.SerializerMethodField()

    
    class Meta:
        model = Vacancy
        fields = ['vacancy_id', 'job_type_name']

    def get_job_type_name(self, obj):
        return get_job_type_display(obj)

class ListEventsWithVacanciesSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source='id', read_only=True)
    event_name = serializers.CharField(source='name', read_only=True)
    vacancies = VacancyEventSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['event_id', 'event_name', 'vacancies']

