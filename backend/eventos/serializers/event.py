from rest_framework import serializers
from eventos.errors.events_messages import EVENT_START_DATE_AFTER_END_DATE, EVENT_START_TIME_NOT_BEFORE_END_TIME, EVENT_START_DATE_IN_PAST
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


class CreateEventInputSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date','end_date', 'start_time', 'end_time', 'location', 'created_at', 'updated_at', 'category_id', 'latitude', 'longitude']
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
    
class EventCreateOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'description']
    

class EventOwnerSerializer(serializers.ModelSerializer):
    profile_image = ImageSerializer(allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'profile_image']


class EventSerializer(serializers.ModelSerializer):
    owner = EventOwnerSerializer()
    category = ListCategorySerializer()
    state = EventStateSerializer()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'owner', 'category', 'state']