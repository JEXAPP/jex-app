from rest_framework import serializers
from applications.constants import ApplicationStates, OfferStates
from applications.errors.application_messages import APPLICATION_NOT_FOUND, APPLICATION_NOT_PENDING, APPLICATION_PERMISSION_DENIED
from applications.errors.offer_messages import EMPLOYEE_NOT_FOUND, EMPLOYER_PROFILE_NOT_FOUND, INVALID_SHIFTS, OFFER_ALREADY_EXISTS, OFFER_NOT_PENDING, MAX_OFFERS_REACHED
from applications.models.applications import Application
from applications.models.applications_states import ApplicationState
from applications.models.offers import Offer
from applications.utils import get_job_type_display
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from eventos.serializers.event import EventSerializer
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from rest_framework import serializers
from django.utils import timezone

from vacancies.constants import JobTypesEnum
from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from eventos.models.event import Event
from vacancies.serializers.job_types import ListJobTypesSerializer
from applications.models.offers import OfferState
from vacancies.models.requirements import Requirements
from vacancies.serializers.shifts import ShiftDetailForOfferByStateSerializer


class OfferCreateSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(required=False)
    employee_id = serializers.IntegerField(required=False)
    shift_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )

    additional_comments = serializers.CharField(required=False, allow_blank=True)
    expiration_date = serializers.DateField(required=False, input_formats=["%d/%m/%Y"])
    expiration_time = serializers.TimeField(required=False, input_formats=["%H:%M"])

    class Meta:
        model = Offer
        fields = [
            'id', 'application_id', 'employee_id', 'shift_ids',
            'additional_comments', 'expiration_date', 'expiration_time'
        ]

    def validate(self, attrs):
        user = self.context['user']
        application_id = attrs.get('application_id')

        try:
            employer = EmployerProfile.objects.get(user=user)
        except EmployerProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYER_PROFILE_NOT_FOUND)

        attrs['employer'] = employer

        if application_id:
            # ============================
            # FLUJO 1: A partir de aplicación
            # ============================
            try:
                application = Application.objects.select_related(
                    'employee__user',
                    'shift__vacancy__event',
                    'shift__vacancy__job_type',
                    'state'
                ).get(id=application_id)
            except Application.DoesNotExist:
                raise serializers.ValidationError(APPLICATION_NOT_FOUND)

            if application.shift.vacancy.event.owner != user:
                raise serializers.ValidationError(APPLICATION_PERMISSION_DENIED)

            pending_state = ApplicationState.objects.get(name=ApplicationStates.PENDING.value)
            if application.state_id != pending_state.id:
                raise serializers.ValidationError(APPLICATION_NOT_PENDING)

            shift = application.shift
            max_quantity = shift.quantity
            current_offers = Offer.objects.filter(
                selected_shift=shift
            ).exclude(state__name=OfferStates.REJECTED.value).count()

            if current_offers >= max_quantity:
                raise serializers.ValidationError(MAX_OFFERS_REACHED.format(max_quantity=max_quantity))

            # Validar que no exista oferta previa del mismo employer al mismo employee
            if Offer.objects.filter(
                employee=application.employee,
                employer=employer,
                selected_shift=shift
            ).exists():
                raise serializers.ValidationError(OFFER_ALREADY_EXISTS)

            attrs['application'] = application
            attrs['employee'] = application.employee
            attrs['shifts'] = [shift]

        else:
            # ============================
            # FLUJO 2: Oferta directa
            # ============================
            employee_id = attrs.get('employee_id')
            shift_ids = attrs.get('shift_ids', [])

            if not employee_id or not shift_ids:
                raise serializers.ValidationError("Se requiere employee_id y al menos un shift_id si no hay application_id.")

            try:
                employee = EmployeeProfile.objects.get(id=employee_id)
            except EmployeeProfile.DoesNotExist:
                raise serializers.ValidationError(EMPLOYEE_NOT_FOUND)

            shifts = Shift.objects.filter(id__in=shift_ids).select_related("vacancy__event")

            if not shifts.exists():
                raise serializers.ValidationError(INVALID_SHIFTS)

            for shift in shifts:
                if shift.vacancy.event.owner != user:
                    raise serializers.ValidationError(APPLICATION_PERMISSION_DENIED)

                max_quantity = shift.quantity
                current_offers = Offer.objects.filter(
                    selected_shift=shift
                ).exclude(state__name=OfferStates.REJECTED.value).count()

                if current_offers >= max_quantity:
                    raise serializers.ValidationError(MAX_OFFERS_REACHED.format(max_quantity=max_quantity))

                # 🔹 Validar oferta repetida
                if Offer.objects.filter(employee=employee, employer=employer, selected_shift=shift).exists():
                    raise serializers.ValidationError(OFFER_ALREADY_EXISTS)

            attrs['application'] = None
            attrs['employee'] = employee
            attrs['shifts'] = list(shifts)

        return attrs

    def create(self, validated_data):
        validated_data.pop('application_id', None)
        validated_data.pop('employee_id', None)
        validated_data.pop('shift_ids', None)

        application = validated_data.pop('application')
        employer = validated_data.pop('employer')
        employee = validated_data.pop('employee')
        shifts = validated_data.pop('shifts')

        state_pending = OfferState.objects.get(name=OfferStates.PENDING.value)

        offers = []
        for shift in shifts:
            offer = Offer.objects.create(
                application=application,
                employee=employee,
                employer=employer,
                selected_shift=shift,
                state=state_pending,
                **validated_data
            )
            offers.append(offer)

        if application:
            offert_state = ApplicationState.objects.get(name=ApplicationStates.OFFERT.value)
            application.state = offert_state
            application.save(update_fields=['state'])

        return offers[0] if application else offers



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name"]



class VacancySerializer(serializers.ModelSerializer):
    event = EventSerializer()
    job_type = serializers.SerializerMethodField()
    

    class Meta:
        model = Vacancy
        fields = ["id", "description", "event", "job_type"]

    def get_job_type(self, obj):
        return get_job_type_display(obj)
    

class ShiftSerializer(serializers.ModelSerializer):
    vacancy = VacancySerializer()
    start_date = CustomDateField()
    start_time = CustomTimeField()
    end_date = CustomDateField()
    end_time = CustomTimeField()


    class Meta:
        model = Shift
        fields = ["id", "start_time", "start_date", "end_date", "end_time", "payment", "vacancy"]


class ApplicationSerializer(serializers.ModelSerializer):
    shift = ShiftSerializer()

    class Meta:
        model = Application
        fields = ["id", "shift"]


class OfferConsultSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer()
    expiration_date = CustomDateField()
    expiration_time = CustomTimeField()

    class Meta:
        model = Offer
        fields = ["id", "expiration_date", "expiration_time", 'application']


class OfferDecisionSerializer(serializers.Serializer):
    rejected = serializers.BooleanField()
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if 'rejection_reason' in attrs:
            attrs['rejection_reason'] = attrs['rejection_reason'].strip()
        return attrs

    def save(self, **kwargs):
        offer = self.context['offer']
        user = self.context['request'].user

        # 🔹 Validar que la oferta esté en estado PENDING
        if offer.state.name != OfferStates.PENDING.value:
            raise serializers.ValidationError(OFFER_NOT_PENDING)

        offer.confirmed_at = timezone.now()

        if self.validated_data['rejected']:
            offer.state = OfferState.objects.get(name=OfferStates.REJECTED.value)
            offer.rejection_reason = self.validated_data.get('rejection_reason', '')

            if offer.application:
                pending_state = ApplicationState.objects.get(name=ApplicationStates.PENDING.value)
                offer.application.state = pending_state
                offer.application.save(update_fields=['state'])

        else:
            offer.state = OfferState.objects.get(name=OfferStates.ACCEPTED.value)
            offer.rejection_reason = None

            if offer.application:
                confirmed_state = ApplicationState.objects.get(name=ApplicationStates.CONFIRMED.value)
                offer.application.state = confirmed_state
                offer.application.save(update_fields=['state'])

        offer.save()
        return offer

class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ["id", "description"]

class EventDetailSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Event
        fields = ["id", "name", "location", "latitude", "longitude","owner_username"]

class VacancyDetailSerializer(serializers.ModelSerializer):
    event = EventDetailSerializer()
    job_type = serializers.SerializerMethodField()
    requirements = RequirementSerializer(many=True, read_only=True)


    class Meta:
        model = Vacancy
        fields = ["id", "description", "event", "job_type", "requirements"]

    def get_requirements(self, obj):
        return [r.description for r in obj.requirements.all()]
    
    def get_job_type(self, obj):
        return get_job_type_display(obj)

class ShiftDetailSerializer(serializers.ModelSerializer):
    vacancy = VacancyDetailSerializer()
    start_date = CustomDateField()
    start_time = CustomTimeField()
    end_date = CustomDateField()
    end_time = CustomTimeField()

    class Meta:
        model = Shift
        fields = ["id", "start_time", "start_date", "end_date", "end_time", "payment", "vacancy"]

class ApplicationDetailSerializer(serializers.ModelSerializer):
    shift = ShiftDetailSerializer()

    class Meta:
        model = Application
        fields = ["id", "shift"]

class OfferDetailSerializer(serializers.ModelSerializer):
    application = ApplicationDetailSerializer()
    additional_comments = serializers.CharField()
    expiration_date = CustomDateField()
    expiration_time = CustomTimeField()

    class Meta:
        model = Offer
        fields = ["id", "expiration_date", "expiration_time", "additional_comments", "application"]

class OfferStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferState
        fields = ["id", "name"]

class OfferEventByStateSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.user.first_name", read_only=True)
    employee_lastname = serializers.CharField(source="employee.user.last_name", read_only=True)
    job_type = serializers.SerializerMethodField()
    shift = ShiftDetailForOfferByStateSerializer(source="selected_shift", read_only=True)
    offer_state = OfferStateSerializer(source="state", read_only=True)

    expiration_date = CustomDateField(required=False)
    expiration_time = CustomTimeField(required=False)

    class Meta:
        model = Offer
        fields = [
            "id",
            "employee_name",
            "employee_lastname",
            "job_type",
            "shift",
            "offer_state",
            "expiration_date",
            "expiration_time",
        ]

    def get_job_type(self, obj):
        v = obj.selected_shift.vacancy
        return v.specific_job_type if v.job_type.id == 11 and v.specific_job_type else v.job_type.name



class OfferAcceptedDetailSerializer(serializers.ModelSerializer):
    # Sobrescribimos el id para que sea el de la Offer
    id = serializers.IntegerField(source="offer.id", read_only=True)

    # Campos del shift
    start_date = CustomDateField()
    end_date = CustomDateField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    payment = serializers.DecimalField(max_digits=10, decimal_places=2)

    # Campos de la vacancy
    vacancy_description = serializers.CharField(source="vacancy.description", read_only=True)
    job_type = serializers.SerializerMethodField()
    requirements = RequirementSerializer(source="vacancy.requirements", many=True, read_only=True)

    # Campos del evento
    event_name = serializers.CharField(source="vacancy.event.name", read_only=True)
    event_location = serializers.CharField(source="vacancy.event.location", read_only=True)

    class Meta:
        model = Shift
        fields = [
            "id",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "payment",
            "vacancy_description",
            "job_type",
            "requirements",
            "event_name",
            "event_location",
        ]

    def get_job_type(self, obj):
        return obj.vacancy.get_job_type_display()
    
