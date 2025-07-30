from rest_framework import serializers
from eventos.models import Vacancy, Shift

class ApplicationCreateSerializer(serializers.Serializer):
    vacancy_id = serializers.IntegerField()
    shifts = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_vacancy_id(self, value):
        if not Vacancy.objects.filter(id=value).exists():
            raise serializers.ValidationError("Vacancy does not exist.")
        return value

    def validate_shifts(self, value):
        if not all(isinstance(i, int) for i in value):
            raise serializers.ValidationError("All shift IDs must be integers.")
        return value

    def validate(self, data):
        vacancy_id = data['vacancy_id']
        shifts = data['shifts']
        valid_shift_ids = set(
            Shift.objects.filter(id__in=shifts, vacancy_id=vacancy_id)
            .values_list('id', flat=True)
        )
        if valid_shift_ids != set(shifts):
            raise serializers.ValidationError("One or more shifts do not belong to the vacancy.")
        return data


class ApplicationResponseShiftSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class ApplicationResponseVacancySerializer(serializers.Serializer):
    vacancy_id = serializers.IntegerField()
    vacancy_title = serializers.CharField()
    shifts = ApplicationResponseShiftSerializer(many=True)


class ApplicationResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    applications = ApplicationResponseVacancySerializer(many=True)