from rest_framework import serializers
from eventos.models.vacancy import Vacancy
from eventos.models.event import Event


# class VacancyInlineSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Vacancy
#         fields = [
#             'id',
#             'job_type_id',
#             'state_id',
#             'specific_job_type',
#         ]


# class EventWithVacanciesSerializer(serializers.ModelSerializer):
#     vacancies = VacancyInlineSerializer(many=True, source='vacancies')


#     class Meta:
#         model = Event
#         fields = [
#             'id',
#             'name',
#             'start_date',
#             'end_date',
#             'start_time',
#             'end_time',
#             'location',
#             'owner_id',
#             'vacancies',
#         ]
class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'

class EventWithVacanciesSerializer(serializers.ModelSerializer):
    vacancies = VacancySerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'  # o ['id', 'name', 'vacancies', ...]
