from rest_framework import serializers
from eventos.constants import VacancyStates
from eventos.models.requirements import Requirements
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.models.vacancy_state import VacancyState
from eventos.serializers.requirements import RequirementSerializer
from eventos.serializers.shifts import ShiftSerializer

class VacancySerializer(serializers.ModelSerializer):
    requirements = RequirementSerializer(many=True, write_only=True)
    shifts = ShiftSerializer(many=True, write_only=True)

    class Meta:
        model = Vacancy
        fields = ['id', 'description', 'event', 'job_type', 'requirements', 'shifts']
        read_only_fields = ['id', 'state']

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')

        if event.owner != user:
            raise serializers.ValidationError("You do not have permission to create vacancies for this event.")
        return data

    def create(self, validated_data):
        requirements_data = validated_data.pop('requirements')
        shifts_data = validated_data.pop('shifts')

        public_state = VacancyState.objects.get(name=VacancyStates.ACTIVE.value)
        validated_data['state'] = public_state

        vacancy = Vacancy.objects.create(**validated_data)

        for req_data in requirements_data:
            Requirements.objects.create(vacancy=vacancy, **req_data)

        for shift_data in shifts_data:
            Shift.objects.create(vacancy=vacancy, **shift_data)


        return vacancy
    
class VacancyShiftSerializer(serializers.ModelSerializer):
    vacancy_id = serializers.IntegerField(source='vacancy.id')
    event_name = serializers.CharField(source='vacancy.event.name')
    start_date = serializers.DateField()
    payment = serializers.DecimalField(max_digits=10, decimal_places=2)
    job_type_name = serializers.CharField(source='vacancy.job_type.name')

    class Meta:
        model = Shift
        fields = ['vacancy_id', 'event_name', 'start_date', 'payment', 'job_type_name']