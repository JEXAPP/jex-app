from rest_framework import serializers
from user_auth.models.language import EmployeeLanguage, LanguageLevel


class LanguageLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageLevel
        fields = ['id', 'name']


class EmployeeLanguageSerializer(serializers.ModelSerializer):
    level = LanguageLevelSerializer()

    class Meta:
        model = EmployeeLanguage
        fields = ['id', 'language', 'level', 'notes']


class EmployeeLanguageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeLanguage
        fields = ['language', 'level', 'notes']

