from rest_framework import serializers
from rating.models import Rating, Behavior
from user_auth.models import CustomUser
from eventos.models.event import Event
from rating.models import Behavior
from user_auth.models import CustomUser
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

# class ListParticipationEmployeeSerializer(serializers.ModelSerializer):
#     employer_name = serializers.SerializerMethodField()
#     event_name = serializers.SerializerMethodField()
#     event_start_date = serializers.SerializerMethodField()
#     event_end_date = serializers.SerializerMethodField()
#     event_start_time = serializers.SerializerMethodField()
#     event_end_time = serializers.SerializerMethodField()
#     shift_role = serializers.SerializerMethodField()
#     shift_number = serializers.SerializerMethodField()
#     shift_start_time = serializers.SerializerMethodField()
#     shift_end_time = serializers.SerializerMethodField()

#     class Meta:
#         model = Offer
#         fields = [
#             "employer_name",
#             "event_name",
#             "event_start_date",
#             "event_end_date",
#             "event_start_time",
#             "event_end_time",
#             "shift_role",
#             "shift_number",
#             "shift_start_time",
#             "shift_end_time"
#         ]

#     def get_employer_name(self, obj):
#         employer = obj.selected_shift.vacancy.event.employer
#         return f"{employer.first_name} {employer.last_name}"

#     def get_event_name(self, obj):
#         return obj.selected_shift.vacancy.event.name

#     def get_event_start_date(self, obj):
#         return obj.selected_shift.vacancy.event.start_date

#     def get_event_end_date(self, obj):
#         return obj.selected_shift.vacancy.event.end_date

#     def get_event_start_time(self, obj):
#         return obj.selected_shift.vacancy.event.start_time

#     def get_event_end_time(self, obj):
#         return obj.selected_shift.vacancy.event.end_time

#     def get_shift_role(self, obj):
#         return obj.selected_shift.vacancy.role

#     def get_shift_number(self, obj):
#         # Solo si tienes un número de turno
#         return getattr(obj.selected_shift, "number", None)

#     def get_shift_start_time(self, obj):
#         return getattr(obj.selected_shift, "start_time", None)

#     def get_shift_end_time(self, obj):
#         return getattr(obj.selected_shift, "end_time", None)