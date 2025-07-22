from rest_framework import serializers
from eventos.models.job_types import JobType


class JobTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = ['id', 'name']