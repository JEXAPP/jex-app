from rest_framework import serializers
from eventos.models.category_events import Category
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.constants import EventStates

class EventSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'start_date','end_date', 'start_time', 'end_time', 'location', 'created_at', 'updated_at', 'category_id']
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def create(self, validated_data):
            user = self.context['request'].user
            validated_data['owner'] = user

            public_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
            validated_data['state'] = public_state

            return Event.objects.create(**validated_data)
    
    

    
