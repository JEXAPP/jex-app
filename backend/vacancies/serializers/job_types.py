from rest_framework import serializers
from vacancies.models.job_types import JobType


class ListJobTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = ['id', 'name']