from rest_framework import serializers
from rating.models import Rating, Behavior
from eventos.models.event import Event

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'rating', 'comments', 'event']

    def create(self, validated_data):
        request = self.context['request']
        rater = request.user
        employee_id = self.context['employee_id']
        # Obtén el usuario que recibe el rating
        from user_auth.models import CustomUser
        employee_user = CustomUser.objects.get(pk=employee_id)
        # Busca o crea el Behavior
        behavior, _ = Behavior.objects.get_or_create(user=employee_user)
        # Si necesitas el evento, puedes obtenerlo de context o de validated_data
        event = validated_data.get('event', None)
        rating = Rating.objects.create(
            behavior=behavior,
            rater=rater,
            event=event,
            rating=validated_data['rating'],
            comments=validated_data.get('comments', "")
        )
        behavior.update_average_rating()
        return rating