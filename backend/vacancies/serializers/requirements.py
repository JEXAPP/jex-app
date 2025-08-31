    
from rest_framework import serializers
from vacancies.models.requirements import Requirements

class CreateRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ['description']

    @staticmethod
    def bulk_create(vacancy, requirements_data):
        objs = [Requirements(vacancy=vacancy, **data) for data in requirements_data]
        Requirements.objects.bulk_create(objs)


class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ['description']