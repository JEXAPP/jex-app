from rest_framework import serializers
from eventos.constants import JobTypesEnum, VacancyStates
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState
from eventos.serializers.event import EventSerializer
from eventos.serializers.requirements import CreateRequirementSerializer, RequirementSerializer
from eventos.serializers.shifts import CreateShiftSerializer, ShiftSerializer
from django.db import transaction


class CreateVacancyListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        return [self.child.create(item) for item in validated_data]


class CreateVacancySerializer(serializers.ModelSerializer):
    requirements = CreateRequirementSerializer(many=True, write_only=True)
    shifts = CreateShiftSerializer(many=True, write_only=True)

    class Meta:
        model = Vacancy
        fields = [
            'id',
            'description',
            'event',
            'job_type',
            'specific_job_type',
            'requirements',
            'shifts'
        ]
        read_only_fields = ['id', 'state']
        list_serializer_class = CreateVacancyListSerializer

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')
        shifts = data.get('shifts', [])

        if event and shifts:
            event_start = event.start_date
            event_end = event.end_date
            event_start_time = event.start_time
            event_end_time = event.end_time
            for shift in shifts:
                if shift['start_date'] < event_start or shift['end_date'] > event_end:
                    raise serializers.ValidationError(
                        f"Shifts ({shift['start_date']} - {shift['end_date']}) deben estar dentro del evento ({event_start} - {event_end})."
                    )
                elif shift['start_time'] < event_start_time or shift['end_time'] > event_end_time:
                    raise serializers.ValidationError(
                        f"Shifts ({shift['start_time']} - {shift['end_time']}) deben estar dentro del horario del evento ({event_start_time} - {event_end_time})."
                    )

        if event.owner != user:
            raise serializers.ValidationError("No tiene permiso para este evento.")

        job_type = data.get('job_type')
        specific = data.get('specific_job_type')

        if job_type and job_type.name == JobTypesEnum.OTRO.value and not specific:
            raise serializers.ValidationError("Debe especificar el tipo de trabajo si selecciona 'OTRO'.")
        elif specific and (not job_type or job_type.name != JobTypesEnum.OTRO.value):
            raise serializers.ValidationError("No debe especificar tipo de trabajo salvo que el tipo sea 'OTRO'.")

        return data

    def create(self, validated_data):
        requirements = validated_data.pop('requirements')
        shifts = validated_data.pop('shifts')
        validated_data['state'] = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)

        with transaction.atomic():
            vacancy = Vacancy.objects.create(**validated_data)
            CreateRequirementSerializer.bulk_create(vacancy, requirements)
            CreateShiftSerializer.bulk_create(vacancy, shifts)
        return vacancy

    def to_representation(self, instance):
        return {'id': instance.id, 'description': instance.description}
    
class ListVacancyShiftSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source='vacancy.id')
    event_name = serializers.CharField(source='vacancy.event.name')
    job_type_name = serializers.CharField(source='vacancy.job_type.name')
    specific_job_type = serializers.CharField(source='vacancy.specific_job_type', allow_blank=True)
    start_date = serializers.SerializerMethodField()

    class Meta:
        model = Shift
        fields = ['vacancy_id', 'event_name', 'start_date', 'payment', 'job_type_name', 'specific_job_type']
    
    def get_start_date(self, obj):
        return obj.start_date.strftime('%d/%m/%Y') if obj.start_date else None


class SearchVacancyResultSerializer(serializers.ModelSerializer):
    event = serializers.CharField(source='event.name', read_only=True)
    job_type = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ['id', 'event', 'job_type', 'payment', 'start_date']

    def get_job_type(self, obj):
        return obj.specific_job_type if obj.specific_job_type else obj.job_type.name

    def get_payment(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        return top_shift.payment if top_shift else None

    def get_start_date(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        if top_shift and top_shift.start_date:
            return top_shift.start_date.strftime('%d/%m/%Y')
    
    
class SearchVacancyParamsSerializer(serializers.Serializer):
    choices = ['role', 'event', 'start_date']
    
    choice = serializers.ChoiceField(choices=choices)
    value = serializers.CharField()

    def validate(self, data):
        if data['choice'] == 'start_date':
            from datetime import datetime
            try:
                datetime.strptime(data['value'], '%d/%m/%Y')
            except ValueError:
                raise serializers.ValidationError("start_date must be in DD/MM/YYYY format")
        return data
    

class VacancyDetailSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(many=True, read_only=True)
    requirements = RequirementSerializer(many=True, read_only=True)
    event = EventSerializer()
    state = serializers.StringRelatedField()
    job_type = serializers.StringRelatedField()

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'specific_job_type', 'state', 'job_type', 'event', 'shifts', 'requirements']