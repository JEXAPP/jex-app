from django.forms import ValidationError
from rest_framework import serializers
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.constants import EventStates

class CreateEventSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date','end_date', 'start_time', 'end_time', 'location', 'created_at', 'updated_at', 'category_id']
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
    
