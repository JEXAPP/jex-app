from rest_framework import serializers

from eventos.models.state_events import EventState


class EventStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventState
        fields = ['id', 'name']