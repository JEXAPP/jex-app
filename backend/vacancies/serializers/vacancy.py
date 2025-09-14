from datetime import datetime
from rest_framework import serializers
from eventos.serializers.state_events import EventStateSerializer
from vacancies.constants import JobTypesEnum, VacancyStates
from vacancies.errors.vacancies_messages import NO_PERMISSION_EVENT, SHIFTS_OUT_OF_EVENT, SHIFTS_START_AFTER_END, SPECIFIC_JOB_TYPE_NOT_ALLOWED, SPECIFIC_JOB_TYPE_REQUIRED
from vacancies.formatters.date_time import CustomDateField, CustomTimeField
from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from vacancies.models.vacancy_state import VacancyState
from vacancies.serializers.job_types import ListJobTypesSerializer
from vacancies.serializers.requirements import CreateRequirementSerializer, RequirementSerializer
from vacancies.serializers.shifts import CreateShiftSerializer, ShiftForOfferSerializer, ShiftSerializer
from eventos.serializers.event import EventSerializer
from eventos.models.event import Event
from django.db import transaction
from applications.utils import get_job_type_display

from vacancies.serializers.vacancy_state import ListsVacancyStates


"""
Serializers for creation and update vacancy
"""
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
            raise serializers.ValidationError(NO_PERMISSION_EVENT)

    def _validate_shifts(self, data):
        event = data.get('event')
        shifts = data.get('shifts') or []
        if not event or not shifts:
            return

        event_start = datetime.combine(event.start_date, event.start_time)
        event_end = datetime.combine(event.end_date, event.end_time)

        for i, shift in enumerate(shifts):
            shift_start = datetime.combine(shift['start_date'], shift['start_time'])
            shift_end = datetime.combine(shift['end_date'], shift['end_time'])

            if shift_start < event_start or shift_end > event_end:
                raise serializers.ValidationError(
                    SHIFTS_OUT_OF_EVENT.format(shift_number=i+1)
                    )

            # Validación: inicio < fin
            if shift_start >= shift_end:
                raise serializers.ValidationError(
                    SHIFTS_START_AFTER_END.format(shift_number=i+1)
                )

    def _validate_job_type(self, data):
        job_type = data.get('job_type')
        specific = data.get('specific_job_type')
        otro = JobTypesEnum.OTRO.value

        if job_type and job_type.name == otro and not specific:
            raise serializers.ValidationError(SPECIFIC_JOB_TYPE_REQUIRED)
        elif specific and (not job_type or job_type.name != otro):
            raise serializers.ValidationError(SPECIFIC_JOB_TYPE_NOT_ALLOWED)

    def create(self, validated_data):
        requirements = validated_data.pop('requirements', [])
        shifts = validated_data.pop('shifts', [])
        validated_data['state'] = VacancyState.objects.get(name=VacancyStates.DRAFT.value)

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
    """Serializer reducido para devolver solo info básica después del create y el update."""
    class Meta:
        model = Vacancy
        fields = ['id', 'description']

"""
Serializer to list vacancies
"""
    
class ListVacancyShiftSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source='vacancy.id')
    event_name = serializers.CharField(source='vacancy.event.name')
    job_type_name = serializers.CharField(source='vacancy.job_type.name')
    specific_job_type = serializers.CharField(source='vacancy.specific_job_type', allow_blank=True)
    start_date = CustomDateField()
    event_image_public_id = serializers.SerializerMethodField()
    event_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Shift
        fields = ['vacancy_id', 'event_name', 'start_date', 'payment', 'job_type_name', 'specific_job_type', 'event_image_public_id', 'event_image_url']

    def get_event_image_public_id(self, obj):
        event_image = getattr(obj.vacancy.event, 'event_image', None)
        return event_image.public_id if event_image else None

    def get_event_image_url(self, obj):
        event_image = getattr(obj.vacancy.event, 'event_image', None)
        return event_image.url if event_image else None

"""
Serializer to search vacancies
"""

class SearchVacancyParamsSerializer(serializers.Serializer):
    """Serializador para validar parámetros de búsqueda de vacantes"""

    CHOICE_OPTIONS = [
        ('role', 'Role'),
        ('event', 'Event'), 
        ('date', 'Date'),
    ]

    choice = serializers.ChoiceField(choices=CHOICE_OPTIONS, required=True)
    value = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False,
        allow_empty=True,
        allow_null=True
    )
    date_from = serializers.DateField(required=False, allow_null=True, input_formats=['%d/%m/%Y'])
    date_to = serializers.DateField(required=False, allow_null=True, input_formats=['%d/%m/%Y'])
    order_by = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def to_internal_value(self, data):
        """
        Convierte 'value' a lista si llega como string plano
        para soportar value=Uno o value=Uno&value=Dos
        """
        if isinstance(data.get("value"), str):
            data["value"] = [data["value"]]
        return super().to_internal_value(data)

    def validate(self, data):
        choice = data.get('choice')
        value = data.get('value')
        date_from = data.get('date_from')
        date_to = data.get('date_to')

        if choice in ['role', 'event']:
            if not value or len(value) == 0:
                raise serializers.ValidationError(
                    f"'value' parameter is required when choice is '{choice}'"
                )
        elif choice == 'date':
            if not date_from:
                raise serializers.ValidationError(
                    "'date_from' parameter is required when choice is 'date'"
                )
            # Si no se proporciona date_to, usar la misma fecha que date_from
            if not date_to:
                data['date_to'] = date_from
            elif date_from > date_to:
                raise serializers.ValidationError(
                    "'date_from' cannot be greater than 'date_to'"
                )

        return data
    
class SearchVacancyResultSerializer(serializers.ModelSerializer):

    vacancy_id = serializers.IntegerField(source='id')
    event_name = serializers.CharField(source='event.name', read_only=True)
    start_date = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    job_type_name = serializers.SerializerMethodField()
    event_image_url = serializers.SerializerMethodField()
    event_image_public_id = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = [
            'vacancy_id',
            'event_name',
            'start_date', 
            'payment',
            'job_type_name',
            'specific_job_type',
            'event_image_url',
            'event_image_public_id'
        ]

    def get_start_date(self, obj):
        """Obtiene la fecha de inicio del turno con mejor pago"""
        best_shift = obj.shifts.order_by('-payment', 'start_date').first()
        if best_shift:
            return best_shift.start_date.strftime('%d/%m/%Y')
        return None

    def get_payment(self, obj):
        """Obtiene el mejor pago de todos los turnos"""
        best_shift = obj.shifts.order_by('-payment').first()
        if best_shift:
            return float(best_shift.payment)
        return None

    def get_job_type_name(self, obj):
        """Obtiene el nombre del rol, priorizando job_type sobre specific_job_type"""
        if obj.job_type:
            return obj.job_type.name
        return obj.specific_job_type if obj.specific_job_type else None
    
    def get_event_image_url(self, obj):
        if obj.event.event_image:
            return obj.event.event_image.url
        return None

    def get_event_image_public_id(self, obj):
        if obj.event.event_image:
            return obj.event.event_image.public_id
        return None
    

"""
Serializer to list vacancy by ID
"""
class VacancyDetailSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(many=True, read_only=True)
    requirements = RequirementSerializer(many=True, read_only=True)
    event = EventSerializer()
    state = serializers.StringRelatedField()
    job_type = serializers.StringRelatedField()

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'specific_job_type', 'state', 'job_type', 'event', 'shifts', 'requirements']

"""
Serializer to list vacancies by employer
"""

class VacancyWithBasicInfoSerializer(serializers.ModelSerializer):
    state = ListsVacancyStates(read_only=True)
    job_type = ListJobTypesSerializer(read_only=True)

    class Meta:
        model = Vacancy
        fields = ['id', 'state', 'job_type', 'specific_job_type']


class EmployerEventsWithVacanciesSerializer(serializers.ModelSerializer):
    vacancies = VacancyWithBasicInfoSerializer(many=True, read_only=True)
    start_date = CustomDateField(read_only=True)
    end_date = CustomDateField(read_only=True)
    start_time = CustomTimeField(read_only=True)
    end_time = CustomTimeField(read_only=True)
    state = EventStateSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'state', 'start_date', 'end_date', 
            'start_time', 'end_time', 'location', 
            'vacancies'
        ]

class VacancyWithShiftsSerializer(serializers.ModelSerializer):
    job_type_name = serializers.SerializerMethodField(read_only=True)
    requirements = RequirementSerializer(many=True, read_only=True)
    shifts = ShiftForOfferSerializer(many=True, read_only=True)

    class Meta:
        model = Vacancy
        fields = [
            'id', 'description', 
            'job_type_name', 'requirements', 'shifts'
        ]

    def get_job_type_name(self, obj):
        return get_job_type_display(obj)

    