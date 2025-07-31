from rest_framework import serializers
from eventos.models.vacancy import Vacancy
from eventos.models.event import Event

class VacancySerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()

    class Meta:
        model = Vacancy
        fields = ['id', 'state', 'job_type']

    def get_state(self, obj):
        return {
            'id': obj.state.id,
            'name': obj.state.name
        }

    def get_job_type(self, obj):
        return {
            'id': obj.job_type.id,
            'name': obj.job_type.name
        }

class EventWithVacanciesSerializer(serializers.ModelSerializer):
    vacancies = VacancySerializer(many=True, read_only=True)
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    def get_start_date(self, obj):
        return obj.start_date.strftime('%d/%m/%Y') if obj.start_date else None
    
    def get_end_date(self, obj):
        return obj.end_date.strftime('%d/%m/%Y') if obj.end_date else None

    def get_start_time(self, obj):
        return obj.start_time.strftime('%H:%M') if obj.start_time else None
    def get_end_time(self, obj):
        return obj.end_time.strftime('%H:%M') if obj.end_time else None
    
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'start_date', 'end_date', 
            'start_time', 'end_time', 'location', 
            'vacancies'
        ]
