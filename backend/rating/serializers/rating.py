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

