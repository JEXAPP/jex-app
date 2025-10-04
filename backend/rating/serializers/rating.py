from rest_framework import serializers
from rating.models import Rating, Behavior
from user_auth.models import CustomUser
from user_auth.models.employer import EmployerProfile
from eventos.models.event import Event
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from applications.models import Offer
from applications.utils import get_job_type_display
from rating.utils import has_already_rated
from rating.errors.rating_menssage import (
    EMPLOYER_NOT_FOUND,
    RATING_ALREADY_EXISTS,
    EVENT_NOT_FOUND,
)
from rating.errors.rating_menssage import EMPLOYEE_NOT_FOUND
 

class SingleRatingSerializer(serializers.Serializer):
    employee = serializers.IntegerField(required=True)
    rating = serializers.FloatField(required=True)
    comments = serializers.CharField(required=False, allow_blank=True)
    event = serializers.IntegerField(required=True)

    def create(self, validated_data):
        request = self.context['request']
        rater = request.user
        # Use objects attached by validate (employee_user, event_obj) if present
        employee_user = validated_data.get('employee_user')
        event = validated_data.get('event_obj')
        if not employee_user or not event:
            # fallback to fetch (defensive)
            employee_id = validated_data['employee']
            event_id = validated_data['event']
            try:
                employee_user = CustomUser.objects.get(pk=employee_id)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError(EMPLOYEE_NOT_FOUND)
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                raise serializers.ValidationError(EVENT_NOT_FOUND)

        # Busca o crea el Behavior
        behavior, _ = Behavior.objects.get_or_create(user=employee_user)

        # Crea el rating
        rating = Rating.objects.create(
            behavior=behavior,
            rater=rater,
            event=event,
            rating=validated_data['rating'],
            comments=validated_data.get('comments', "")
        )
        behavior.update_average_rating()

        return rating

    def validate(self, data):
        """Validate employee and event exist, and that the rater hasn't already rated.

        Attaches 'employee_user' and 'event_obj' to the validated data for reuse.
        """
        employee_id = data.get('employee')
        event_id = data.get('event')

        # Validate employee exists
        try:
            employee_user = CustomUser.objects.get(pk=employee_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_NOT_FOUND)

        # Validate event exists
        try:
            event_obj = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError(EVENT_NOT_FOUND)

        # Check duplicate rating
        request = self.context.get('request')
        rater = getattr(request, 'user', None)
        if rater and Rating.objects.filter(
            behavior__user=employee_user,
            rater=rater,
            event_id=event_id,
        ).exists():
            raise serializers.ValidationError(RATING_ALREADY_EXISTS)

        data['employee_user'] = employee_user
        data['event_obj'] = event_obj
        return data


class ViewRatingsSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    average_rating = serializers.FloatField()

    class Meta:
        model = Behavior
        fields = [
            'average_rating',
            'user_full_name',
        ]
    
    def get_user_full_name(self, obj):
        user = obj.user
        return f"{user.first_name} {user.last_name}".strip()


class ListEmployerEventsSerializer(serializers.ModelSerializer):
    employer_id = serializers.IntegerField(
        source=(
            "selected_shift.vacancy."
            "event.owner.id"
        )
    )
    company_name = serializers.SerializerMethodField()
    employer_full_name = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()
    event_id = serializers.IntegerField(
        source=("selected_shift.vacancy." "event.id")
    )
    event_name = serializers.CharField(
        source=("selected_shift.vacancy." "event.name")
    )
    event_start_date = CustomDateField(
        source=("selected_shift.vacancy." "event.start_date"), read_only=True
    )
    event_end_date = CustomDateField(
        source=("selected_shift.vacancy." "event.end_date"), read_only=True
    )
    event_start_time = CustomTimeField(
        source=("selected_shift.vacancy." "event.start_time"), read_only=True
    )
    event_end_time = CustomTimeField(
        source=("selected_shift.vacancy." "event.end_time"), read_only=True
    )
    already_rated = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            "employer_id",
            "company_name",
            "employer_full_name",
            "job_type",
            "event_id",
            "event_name",
            "event_start_date",
            "event_start_time",
            "event_end_date",
            "event_end_time",
            "already_rated"
        ]

    def get_owner_full_name(self, obj):
        owner = obj.selected_shift.vacancy.event.owner
        return f"{owner.first_name} {owner.last_name}"
    
    # rename helper to match field name `employer_full_name`
    def get_employer_full_name(self, obj):
        owner = obj.selected_shift.vacancy.event.owner
        return f"{owner.first_name} {owner.last_name}"

    def get_company_name(self, obj):
        owner_user = obj.selected_shift.vacancy.event.owner
        try:
            employer_profile = owner_user.employer_profile
            return employer_profile.company_name
        except EmployerProfile.DoesNotExist:
            return None

    def get_job_type(self, obj):
        return get_job_type_display(obj.selected_shift.vacancy)

    def get_already_rated(self, obj):
        request = self.context.get('request')
        # owner is the employer user for the event
        owner_user = obj.selected_shift.vacancy.event.owner
        # current user (the rater) may be anonymous in some contexts
        rater = getattr(request, 'user', None) if request is not None else None

        # event instance
        event = obj.selected_shift.vacancy.event

        return has_already_rated(
            event=event, rater=rater, rated_user=owner_user
        )


class SingleEmployerRatingSerializer(serializers.Serializer):
    employer = serializers.IntegerField(required=True)
    rating = serializers.FloatField(required=True)
    comments = serializers.CharField(required=False, allow_blank=True)
    event = serializers.IntegerField(required=True)

    def validate(self, data):
        employer_id = data['employer']
        event_id = data['event']
        # Validate employer exists
        try:
            employer_user = CustomUser.objects.get(pk=employer_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                EMPLOYER_NOT_FOUND.format(employer_id=employer_id)
            )

        # Validate event exists
        try:
            event_obj = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError(EVENT_NOT_FOUND)

        # Chequea si ya existe un rating de este empleado a este empleador
        # para este evento
        if Rating.objects.filter(
            behavior__user=employer_user,
            rater=self.context['request'].user,
            event_id=event_id,
        ).exists():
            raise serializers.ValidationError(RATING_ALREADY_EXISTS)

        # Attach found objects for use by the view
        data['employer_user'] = employer_user
        data['event_obj'] = event_obj

        return data
