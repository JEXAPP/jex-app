    
from rest_framework import serializers
from eventos.models.requirements import Requirements

class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirements
        fields = ['description']