from rest_framework import serializers
from applications.constants import OfferStates
from applications.errors.application_messages import APPLICATION_NOT_FOUND, APPLICATION_PERMISSION_DENIED
from applications.errors.offer_messages import EMPLOYER_PROFILE_NOT_FOUND, OFFER_NOT_PENDING, REJECTION_REASON_REQUIRED
from applications.models.applications import Application
from applications.models.offers import Offer
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from eventos.serializers.event import EventSerializer
from user_auth.models.employer import EmployerProfile
from rest_framework import serializers
from django.utils import timezone

from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from eventos.models.event import Event
from vacancies.serializers.job_types import ListJobTypesSerializer
from applications.models.offers import OfferState
from vacancies.models.requirements import Requirements
from vacancies.serializers.shifts import ShiftDetailForOfferByStateSerializer


class OfferCreateSerializer(serializers.ModelSerializer):
    additional_comments = serializers.CharField(required=False, allow_blank=True)
    expiration_date = serializers.DateField(required=False, input_formats=["%d/%m/%Y"])
    expiration_time = serializers.TimeField(required=False)

    class Meta:
        model = Offer
        fields = ['additional_comments', 'expiration_date', 'expiration_time', 'id']

    def validate(self, attrs):
        user = self.context['user']
        application_id = self.context['application_id']

        try:
            application = Application.objects.select_related(
                'employee__user',
                'shift__vacancy__event',
                'shift__vacancy__job_type'
            ).get(id=application_id)
        except Application.DoesNotExist:
            raise serializers.ValidationError(APPLICATION_NOT_FOUND)

        # Verificación de permisos
        if application.shift.vacancy.event.owner != user:
            raise serializers.ValidationError(APPLICATION_PERMISSION_DENIED)

        try:
            employer = EmployerProfile.objects.get(user=user)
        except EmployerProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYER_PROFILE_NOT_FOUND)

        attrs['application'] = application
        attrs['employer'] = employer
        return attrs

    def create(self, validated_data):
        application = validated_data.pop('application')
        employer = validated_data.pop('employer')
        shift = application.shift

        state_pending = OfferState.objects.get(name=OfferStates.PENDING.value)
        offer = Offer.objects.create(
            application=application,
            employee=application.employee,
            employer=employer,
            selected_shift=shift,
            state=state_pending,
            **validated_data
        )
        return offer




class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "name"]



class VacancySerializer(serializers.ModelSerializer):
    event = EventSerializer()
    job_type= ListJobTypesSerializer()
    
    

    class Meta:
        model = Vacancy
        fields = ["id", "description", "event", "job_type"]
    

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

        if offer.state_id != 1:  # PENDING
            raise serializers.ValidationError(OFFER_NOT_PENDING)

        offer.confirmed_at = timezone.now()

        #try:
        #     employee_profile = EmployeeProfile.objects.get(user=user)
        #     offer.confirmed_by = employee_profile
        # except EmployerProfile.DoesNotExist:
        #     raise serializers.ValidationError("No se encontró el perfil del empleador.")

        if self.validated_data['rejected']:
            offer.state = OfferState.objects.get(id=3)  # REJECTED
            offer.rejection_reason = self.validated_data.get('rejection_reason', '')
        else:
            offer.state = OfferState.objects.get(id=2)  # ACCEPTED
            offer.rejection_reason = None


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
    job_type = ListJobTypesSerializer()
    requirements = RequirementSerializer(many=True, read_only=True)



    class Meta:
        model = Vacancy
        fields = ["id", "description", "event", "job_type", "requirements"]

    def get_requirements(self, obj):
        return [r.description for r in obj.requirements.all()]

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


