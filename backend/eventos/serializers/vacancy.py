from rest_framework import serializers
from eventos.constants import JobTypesEnum, VacancyStates
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
        fields = ['id', 'description', 'event', 'job_type', 'specific_job_type', 'requirements', 'shifts']
        read_only_fields = ['id', 'state']

    def validate(self, data):
        user = self.context['request'].user
        event = data.get('event')
        job_type = data.get('job_type') # Podriamos validar con esto si tiene que venir una descripcion aparte en caso de "Otros"
        specific_job_type = data.get('specific_job_type')
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

        if job_type and job_type.name == JobTypesEnum.OTRO.value:
                    if not specific_job_type:
                        raise serializers.ValidationError(
                            "You must provide a specific job type when selecting 'Others'."
                        )
        elif specific_job_type:
            raise serializers.ValidationError(
                "You should not provide a specific job type unless the job type is 'Others'."
            )
        
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
    specific_job_type = serializers.CharField(source='vacancy.specific_job_type', allow_blank=True)

    class Meta:
        model = Shift
        fields = ['vacancy_id', 'event_name', 'start_date', 'payment', 'job_type_name', 'specific_job_type']

class SearchVacancyResultSerializer(serializers.ModelSerializer):
    event = serializers.CharField(source='event.name', read_only=True)
    job_type = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ['id', 'event', 'job_type', 'payment', 'start_date']

    def get_job_type(self, obj):
        return obj.specific_job_type if obj.specific_job_type else obj.job_type.name

    def get_payment(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        return top_shift.payment if top_shift else None

    def get_start_date(self, obj):
        top_shift = obj.shifts.order_by('-payment').first()
        return top_shift.start_date if top_shift else None
    
class SearchVacancyParamsSerializer(serializers.Serializer):
    choices = ['role', 'event', 'start_date']
    
    choice = serializers.ChoiceField(choices=choices)
    value = serializers.CharField()

    def validate(self, data):
        if data['choice'] == 'start_date':
            from datetime import datetime
            try:
                datetime.strptime(data['value'], '%d/%m/%Y')
            except ValueError:
                raise serializers.ValidationError("start_date must be in DD/MM/YYYY format")
        return data