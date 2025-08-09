from rest_framework import serializers
from eventos.constants import JobTypesEnum, VacancyStates
from eventos.errors.vacancies_messages import NO_PERMISSION_EVENT, SHIFTS_DATES_OUT_OF_EVENT, SHIFTS_TIMES_OUT_OF_EVENT, SPECIFIC_JOB_TYPE_NOT_ALLOWED, SPECIFIC_JOB_TYPE_REQUIRED
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState
from eventos.serializers.event import EventSerializer
from eventos.serializers.requirements import CreateRequirementSerializer, RequirementSerializer
from eventos.serializers.shifts import CreateShiftSerializer, ShiftSerializer
from django.db import transaction
from datetime import datetime



class CreateVacancyListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        return [self.child.create(item) for item in validated_data]


class VacancySerializer(serializers.ModelSerializer):
    requirements = CreateRequirementSerializer(many=True, write_only=True, required=False)
    shifts = CreateShiftSerializer(many=True, write_only=True, required=False)

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
        self._validate_owner(data)
        self._validate_shifts(data)
        self._validate_job_type(data)
        return data

    def _validate_owner(self, data):
        event = data.get('event')
        user = self.context.get('user')
        if event and event.owner != user:
            raise serializers.ValidationError({"event": NO_PERMISSION_EVENT})

    def _validate_shifts(self, data):
        event = data.get('event')
        shifts = data.get('shifts') or []
        if not event or not shifts:
            return

        event_start = event.start_date
        event_end = event.end_date
        event_start_time = event.start_time
        event_end_time = event.end_time

        for shift in shifts:
            if shift['start_date'] < event_start or shift['end_date'] > event_end:
                raise serializers.ValidationError({
                    "shifts": SHIFTS_DATES_OUT_OF_EVENT.format(
                        start_date=shift['start_date'], 
                        end_date=shift['end_date'], 
                        event_start=event_start, 
                        event_end=event_end
                    )
                })
            if shift['start_time'] < event_start_time or shift['end_time'] > event_end_time:
                raise serializers.ValidationError({
                    "shifts": SHIFTS_TIMES_OUT_OF_EVENT.format(
                        start_time=shift['start_time'], 
                        end_time=shift['end_time'], 
                        event_start_time=event_start_time, 
                        event_end_time=event_end_time
                    )
                })

    def _validate_job_type(self, data):
        job_type = data.get('job_type')
        specific = data.get('specific_job_type')
        otro = JobTypesEnum.OTRO.value

        if job_type and job_type.name == otro and not specific:
            raise serializers.ValidationError({"specific_job_type": SPECIFIC_JOB_TYPE_REQUIRED})
        elif specific and (not job_type or job_type.name != otro):
            raise serializers.ValidationError({"specific_job_type": SPECIFIC_JOB_TYPE_NOT_ALLOWED})

    def create(self, validated_data):
        requirements = validated_data.pop('requirements', [])
        shifts = validated_data.pop('shifts', [])
        validated_data['state'] = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)

        with transaction.atomic():
            vacancy = Vacancy.objects.create(**validated_data)
            self._update_requirements(vacancy, requirements)
            self._update_shifts(vacancy, shifts)

        return vacancy

    def update(self, instance, validated_data):
        requirements = validated_data.pop('requirements', None)
        shifts = validated_data.pop('shifts', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        with transaction.atomic():
            instance.save()
            self._update_requirements(instance, requirements)
            self._update_shifts(instance, shifts)

        return instance

    def _update_requirements(self, instance, requirements):
        if requirements is not None:
            instance.requirements.all().delete()
            CreateRequirementSerializer.bulk_create(instance, requirements)

    def _update_shifts(self, instance, shifts):
        if shifts is not None:
            instance.shifts.all().delete()
            CreateShiftSerializer.bulk_create(instance, shifts)


class VacancyResponseSerializer(serializers.ModelSerializer):
    """Serializer reducido para devolver solo info básica después del update."""
    class Meta:
        model = Vacancy
        fields = ['id', 'description']
    
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
    job_type = serializers.CharField(source='job_type.name', read_only=True)
    specific_job_type = serializers.CharField(read_only=True)
    payment = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ['id', 'event', 'job_type', 'specific_job_type','payment', 'start_date']

    def get_payment(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        return top_shift.payment if top_shift else None

    def get_start_date(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        if top_shift and top_shift.start_date:
            return top_shift.start_date.strftime('%d/%m/%Y')
    
    
class SearchVacancyParamsSerializer(serializers.Serializer):
    choice = serializers.ChoiceField(choices=['role', 'event', 'start_date'])
    value = serializers.JSONField()  # Puede recibir lista o string según choice

    def validate(self, data):
        choice = data.get('choice')
        value = data.get('value')

        if choice == 'role':
            # value debe ser lista no vacía de ints
            if not isinstance(value, list) or not all(isinstance(i, int) for i in value):
                raise serializers.ValidationError({
                    'value': 'Debe ser una lista de IDs enteros para choice "role".'
                })
            if not value:
                raise serializers.ValidationError({
                    'value': 'La lista no puede estar vacía para choice "role".'
                })

        elif choice == 'event':
            if not isinstance(value, str) or not value.strip():
                raise serializers.ValidationError({
                    'value': 'Debe ser un texto no vacío para choice "event".'
                })

        elif choice == 'start_date':
            try:
                datetime.strptime(value, '%d/%m/%Y')
            except (ValueError, TypeError):
                raise serializers.ValidationError({
                    'value': 'Debe ser una fecha válida con formato dd/mm/yyyy para choice "start_date".'
                })

        else:
            raise serializers.ValidationError({
                'choice': 'Opción inválida.'
            })

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