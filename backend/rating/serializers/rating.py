from rest_framework import serializers
from rating.models import Rating, Behavior
from user_auth.models import CustomUser
from user_auth.models.employer import EmployerProfile
from user_auth.models.employee import EmployeeProfile
from eventos.models.event import Event
from rating.models import Behavior
from applications.models import Offer
from rating.models import Rating
from applications.utils import get_job_type_display
from rating.utils import has_already_rated
#from applications.models import Offer

class SingleRatingSerializer(serializers.Serializer):
    employee = serializers.IntegerField(required=True)
    rating = serializers.FloatField(required=True)
    comments = serializers.CharField(required=False, allow_blank=True)
    event = serializers.IntegerField(required=True)

    def create(self, validated_data):
        request = self.context['request']
        rater = request.user
        employee_id = validated_data['employee']
        event_id = validated_data['event']

        # Busca el usuario y el evento
        try:
            employee_user = CustomUser.objects.get(pk=employee_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(f"Empleado {employee_id} no encontrado")

        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError(f"Evento {event_id} no encontrado")

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



class ViewRatingsSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    average_rating = serializers.FloatField()

    class Meta:
        model = Behavior
        fields = [
            'average_rating',
            'first_name',
            'last_name',
        ]


class ListEmployerEventsSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source="selected_shift.vacancy.event.owner.id")
    company_name = serializers.SerializerMethodField()
    owner_first_name = serializers.SerializerMethodField()
    owner_last_name = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()
    selected_shift_id = serializers.IntegerField(source="selected_shift.id")
    shift_start_time = serializers.TimeField(source="selected_shift.start_time")
    shift_end_time = serializers.TimeField(source="selected_shift.end_time")
    shift_start_date = serializers.DateField(source="selected_shift.start_date")
    shift_end_date = serializers.DateField(source="selected_shift.end_date")
    event_id = serializers.IntegerField(source="selected_shift.vacancy.event.id")
    event_name = serializers.CharField(source="selected_shift.vacancy.event.name")
    event_start_date = serializers.DateField(source="selected_shift.vacancy.event.start_date")
    event_end_date = serializers.DateField(source="selected_shift.vacancy.event.end_date")
    already_rated = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            "owner_id",
            "company_name",
            "owner_first_name",
            "owner_last_name",
            "job_type",
            "selected_shift_id",
            "shift_start_time",
            "shift_end_time",
            "shift_start_date",
            "shift_end_date",
            "event_id",
            "event_name",
            "event_start_date",
            "event_end_date",
            "already_rated"
        ]

    def get_owner_first_name(self, obj):
        return obj.selected_shift.vacancy.event.owner.first_name

    def get_owner_last_name(self, obj):
        return obj.selected_shift.vacancy.event.owner.last_name
    
    def get_company_name(self, obj):
        owner_user = obj.selected_shift.vacancy.event.owner  # Esto es CustomUser
        try:
            employer_profile = owner_user.employer_profile  # related_name en EmployerProfile
            return employer_profile.company_name
        except EmployerProfile.DoesNotExist:
            return None

    def get_job_type(self, obj):
        return get_job_type_display(obj.selected_shift.vacancy)

    def get_already_rated(self, obj):
        request = self.context.get('request')
        if not request:
            return "not exist"
        event_id = obj.selected_shift.vacancy.event.id
        return has_already_rated(request.user, event_id, rater_type="employee")