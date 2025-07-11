from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'location', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'employer']

    def create(self, validated_data):
        user = self.context['request'].user
        return Event.objects.create(employer=user, **validated_data)
