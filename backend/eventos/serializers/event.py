from rest_framework import serializers
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.job_types import JobType
from eventos.models.requirements import Requirements
from eventos.models.shifts import Shift
from eventos.models.state_events import EventState
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState

class EventSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date','end_date', 'start_time', 'end_time', 'location', 'created_at', 'updated_at', 'category_id']
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def create(self, validated_data):
            user = self.context['request'].user
            validated_data['owner'] = user

            draft_state = EventState.objects.get(name="Borrador")
            validated_data['state'] = draft_state

            return Event.objects.create(**validated_data)
    
    
class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ['description']

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['start_time', 'end_time', 'start_date', 'end_date', 'payment', 'quantity']

class VacancySerializer(serializers.ModelSerializer):
    requirements = RequirementSerializer(many=True, write_only=True)
    shifts = ShiftSerializer(many=True, write_only=True)

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'event', 'job_type', 'state', 'requirements', 'shifts']
        read_only_fields = ['id']

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')

        if event.owner != user:
            raise serializers.ValidationError("You do not have permission to create vacancies for this event.")
        return data

    def create(self, validated_data):
        requirements_data = validated_data.pop('requirements')
        shifts_data = validated_data.pop('shifts')

        vacancy = Vacancy.objects.create(**validated_data)

        for req_data in requirements_data:
            Requirements.objects.create(vacancy=vacancy, **req_data)

        for shift_data in shifts_data:
            Shift.objects.create(vacancy=vacancy, **shift_data)

        return vacancy
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Agregá otros campos si lo necesitás

class JobTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = ['id', 'name']