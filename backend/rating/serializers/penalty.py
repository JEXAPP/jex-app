

from eventos.models.event import Event
from rating.constats import PenaltyStates
from rating.errors.penalty_messages import BEHAVIOR_NOT_FOUND, EVENT_NOT_FOUND, PENALTY_STATE_ALREADY_SET, PENALTY_TYPE_NOT_FOUND, STATE_PENALTY_NOT_ALLOWED, STATE_PENALTY_NOT_FOUND, USER_NOT_FOUND
from rating.models.behavior import Behavior
from rating.models.penalty import Penalty
from rating.models.penalty_category import PenaltyCategory
from rating.models.penalty_story_state import PenaltyStateHistory
from rating.models.penalty_type import PenaltyType
from rest_framework import serializers

from rating.models.state_penalty import StatePenalty
from user_auth.models.user import CustomUser
from django.db import transaction



class PenaltyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PenaltyType
        fields = ['id', 'name']


class PenaltyCategorySerializer(serializers.ModelSerializer):
    types = PenaltyTypeSerializer(many=True, read_only=True)

    class Meta:
        model = PenaltyCategory
        fields = ['id', 'name', 'types']


class CreatePenaltySerializer(serializers.Serializer):
    penalized_user = serializers.IntegerField(required=True)
    event = serializers.IntegerField(required=True)
    penalty_type = serializers.IntegerField(required=True)
    comments = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # Validar usuario penalizado
        try:
            penalized_user = CustomUser.objects.get(pk=data['penalized_user'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(USER_NOT_FOUND)

        # Validar evento
        try:
            event_obj = Event.objects.get(pk=data['event'])
        except Event.DoesNotExist:
            raise serializers.ValidationError(EVENT_NOT_FOUND)

        # Validar tipo de penalización
        try:
            penalty_type_obj = PenaltyType.objects.get(pk=data['penalty_type'])
        except PenaltyType.DoesNotExist:
            raise serializers.ValidationError(PENALTY_TYPE_NOT_FOUND)

        # Buscar el Behavior del usuario penalizado
        try:
            behavior_obj = Behavior.objects.get(user=penalized_user)
        except Behavior.DoesNotExist:
            raise serializers.ValidationError(BEHAVIOR_NOT_FOUND)

        # Guardar objetos validados
        data['penalized_user_obj'] = penalized_user
        data['event_obj'] = event_obj
        data['penalty_type_obj'] = penalty_type_obj
        data['behavior_obj'] = behavior_obj
        return data

    def create(self, validated_data):
        request_user = self.context['request'].user  # punisher
        behavior = validated_data['behavior_obj']
        penalty_type = validated_data['penalty_type_obj']
        event = validated_data['event_obj']
        comments = validated_data.get('comments', '')

        # Estado inicial de la penalización
        in_review_state = PenaltyStates.IN_REVIEW.value
        state_in_review = StatePenalty.objects.filter(name=in_review_state).first()

        penalty = Penalty.objects.create(
            behavior=behavior,
            punisher=request_user,
            event=event,
            comments=comments,
            penalty_state=state_in_review,
            penalty_type=penalty_type
        )
        return penalty
  
class PenalizedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone', 'email']


class PenaltySerializer(serializers.ModelSerializer):
    penalized_user = serializers.SerializerMethodField()
    event_info = serializers.SerializerMethodField()
    penalty_state = serializers.CharField(source='penalty_state.name')
    penalty_type = serializers.CharField(source='penalty_type.name')

    class Meta:
        model = Penalty
        fields = [
            'id',
            'penalized_user',
            'punisher',
            'event_info',
            'comments',
            'penalty_state',
            'penalty_type',
            'penalty_date',
        ]

    def get_penalized_user(self, obj):
        user = obj.behavior.user
        return PenalizedUserSerializer(user).data

    def get_event_info(self, obj):
        event = obj.event
        image_url = event.event_image.url if event.event_image else None
        return {
            'name': event.name,
            'image': image_url
        }
    
class UpdatePenaltyStatusSerializer(serializers.Serializer):

    state_id = serializers.IntegerField(required=True)
    comment = serializers.CharField(required=False, allow_blank=True)

    def validate_state_id(self, value):

        try:
            state_obj = StatePenalty.objects.get(pk=value)
        except StatePenalty.DoesNotExist:
            raise serializers.ValidationError(STATE_PENALTY_NOT_FOUND)

        valid_states = [state.value for state in PenaltyStates]
        if state_obj.name not in valid_states:
            raise serializers.ValidationError(STATE_PENALTY_NOT_ALLOWED)

        self.context["state_obj"] = state_obj
        return value

    def update(self, instance, validated_data):

        request_user = self.context["request"].user
        new_state = self.context["state_obj"]
        comment = validated_data.get("comment", "")

        if instance.penalty_state_id == new_state.id:
            raise serializers.ValidationError(PENALTY_STATE_ALREADY_SET)

        with transaction.atomic():

            instance.penalty_state = new_state
            instance.save(update_fields=["penalty_state"])

            PenaltyStateHistory.objects.create(
                penalty=instance,
                state=new_state,
                changed_by=request_user,
                comment=comment
            )

        return instance
