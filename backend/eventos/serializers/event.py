from django.forms import ValidationError
from rest_framework import serializers
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.constants import EventStates
from eventos.serializers.category_events import ListCategorySerializer
from eventos.serializers.state_events import EventStateSerializer
from media_utils.serializers import ImageSerializer
from user_auth.models.user import CustomUser

class CreateEventSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    start_date = serializers.DateField(input_formats=['%d/%m/%Y'])
    end_date = serializers.DateField(input_formats=['%d/%m/%Y'])
    start_time = serializers.TimeField(input_formats=['%H:%M'])
    end_time = serializers.TimeField(input_formats=['%H:%M'])

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date','end_date', 'start_time', 'end_time', 'location', 'created_at', 'updated_at', 'category_id', 'latitude', 'longitude']
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_date and end_date and start_date > end_date:
            raise ValidationError("La fecha de inicio no puede ser posterior a la fecha de finalización.")

        if start_date == end_date and start_time and end_time and start_time >= end_time:
            raise ValidationError("La hora de inicio debe ser anterior a la hora de fin para el mismo día.")

        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user

        public_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
        validated_data['state'] = public_state

        return Event.objects.create(**validated_data)

    def to_representation(self, instance):
        # Solo devolver id y description al serializar el objeto creado
        return {
            'id': instance.id,
            'description': instance.description
        }  
    

class EventOwnerSerializer(serializers.ModelSerializer):
    profile_image = ImageSerializer(allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'profile_image']


class EventSerializer(serializers.ModelSerializer):
    owner = EventOwnerSerializer()
    category = ListCategorySerializer()
    state = EventStateSerializer()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'owner', 'category', 'state']