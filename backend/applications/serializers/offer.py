from rest_framework import serializers
from applications.constants import OfferStates
from applications.errors.application_messages import APPLICATION_NOT_FOUND, APPLICATION_PERMISSION_DENIED
from applications.errors.offer_messages import EMPLOYER_PROFILE_NOT_FOUND, OFFER_NOT_PENDING, REJECTION_REASON_REQUIRED
from applications.models.applications import Application
from applications.models.offers import Offer
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from eventos.serializers.event import EventSerializer
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from rest_framework import serializers
from datetime import datetime
from django.utils import timezone

from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from eventos.models.event import Event
from vacancies.serializers.job_types import ListJobTypesSerializer


class OfferCreateSerializer(serializers.ModelSerializer):
    additional_comments = serializers.CharField(required=False, allow_blank=True)
    expiration_date = serializers.DateField(required=False, input_formats=["%d/%m/%Y"])
    expiration_time = serializers.TimeField(required=False)

    class Meta:
        model = Offer
        fields = ['additional_comments', 'expiration_date', 'expiration_time']

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

        offer = Offer.objects.create(
            application=application,
            employee=application.employee,
            employer=employer,
            selected_shift=shift,
            state=OfferStates.PENDING.value,
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
        fields = ["id", "start_time", "start_date", "end_date", "end_time", "payment"]


class ApplicationSerializer(serializers.ModelSerializer):
    shift = ShiftSerializer()

    class Meta:
        model = Application
        fields = ["id", "shift"]


class OfferConsultSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer()

    class Meta:
        model = Offer
        fields = ["id", "expiration_date", "expiration_time", 'application']


class OfferDecisionSerializer(serializers.ModelSerializer):
    rejected = serializers.BooleanField()
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Offer
        fields = ['rejected', 'rejection_reason']

    def validate(self, attrs):
        if attrs.get('rejected') and not attrs.get('rejection_reason'):
            raise serializers.ValidationError(REJECTION_REASON_REQUIRED)
        return attrs

    def update(self, instance, validated_data):
        rejected = validated_data.get('rejected')

        if instance.state != OfferStates.PENDING.value:
            raise serializers.ValidationError(OFFER_NOT_PENDING)

        instance.confirmed_at = timezone.now()

        if rejected:
            instance.state = OfferStates.REJECTED.value
            instance.rejection_reason = validated_data.get('rejection_reason', '')
        else:
            instance.state = OfferStates.ACCEPTED.value
            instance.rejection_reason = None

        instance.save()
        return instance