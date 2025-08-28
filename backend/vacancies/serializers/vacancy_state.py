from rest_framework import serializers
from vacancies.errors.vacancies_messages import INVALID_STATE_ID
from vacancies.models.vacancy_state import VacancyState


class UpdateVacancyStateSerializer(serializers.Serializer):
    state_id = serializers.IntegerField()

    def validate_state_id(self, value):
        if not VacancyState.objects.filter(id=value).exists():
            raise serializers.ValidationError(INVALID_STATE_ID)
        return value
    
    
class ListsVacancyStates(serializers.ModelSerializer):
    class Meta:
        model = VacancyState
        fields = ['id', 'name']
