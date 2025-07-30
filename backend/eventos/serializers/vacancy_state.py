from rest_framework import serializers
from eventos.models.vacancy_state import VacancyState


class UpdateVacancyStateSerializer(serializers.Serializer):
    state_id = serializers.IntegerField()

    def validate_state_id(self, value):
        if not VacancyState.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid state ID.")
        return value
