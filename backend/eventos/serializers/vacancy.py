from rest_framework import serializers
from eventos.models.requirements import Requirements
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.serializers.requirements import RequirementSerializer
from eventos.serializers.shifts import ShiftSerializer

class VacancySerializer(serializers.ModelSerializer):
    requirements = RequirementSerializer(many=True, write_only=True)
    shifts = ShiftSerializer(many=True, write_only=True)

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'event', 'job_type', 'state', 'requirements', 'shifts']
        read_only_fields = ['id']

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')

        if event.owner != user:
            raise serializers.ValidationError("You do not have permission to create vacancies for this event.")
        return data

    def create(self, validated_data):
        requirements_data = validated_data.pop('requirements')
        shifts_data = validated_data.pop('shifts')

        vacancy = Vacancy.objects.create(**validated_data)

        for req_data in requirements_data:
            Requirements.objects.create(vacancy=vacancy, **req_data)

        for shift_data in shifts_data:
            Shift.objects.create(vacancy=vacancy, **shift_data)

        return vacancy