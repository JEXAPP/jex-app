from rest_framework import serializers
from eventos.constants import VacancyStates
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState
from eventos.serializers.requirements import CreateRequirementSerializer
from eventos.serializers.shifts import CreateShiftSerializer

class CreateVacancySerializer(serializers.ModelSerializer):
    requirements = CreateRequirementSerializer(many=True, write_only=True)
    shifts = CreateShiftSerializer(many=True, write_only=True)

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'event', 'job_type', 'requirements', 'shifts']
        read_only_fields = ['id', 'state']

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')
        shifts_data = data.get('shifts', [])

        if event and shifts_data:
            event_start = event.start_date
            event_end = event.end_date

            for shift in shifts_data:
                start_date = shift.get('start_date')
                end_date = shift.get('end_date')
                if start_date < event_start or end_date > event_end:
                    raise serializers.ValidationError(
                        f"Shifts date ({start_date} - {end_date}) must be within the event dates ({event_start} - {event_end})."
                    )

        if event.owner != user:
            raise serializers.ValidationError("You do not have permission to create vacancies for this event.")
        return data

    def create(self, validated_data):
        requirements_data = validated_data.pop('requirements')
        shifts_data = validated_data.pop('shifts')

        public_state = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)
        validated_data['state'] = public_state

        vacancy = Vacancy.objects.create(**validated_data)

        CreateRequirementSerializer.bulk_create(vacancy, requirements_data)
        CreateShiftSerializer.bulk_create(vacancy, shifts_data)


        return vacancy
    
class ListVacancyShiftSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source='vacancy.id')
    event_name = serializers.CharField(source='vacancy.event.name')
    job_type_name = serializers.CharField(source='vacancy.job_type.name')

    class Meta:
        model = Shift
        fields = ['vacancy_id', 'event_name', 'start_date', 'payment', 'job_type_name']