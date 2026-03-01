from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from user_auth.errors.language_errors import PROFILE_NOT_FOUND
from user_auth.models.employee import EmployeeProfile
from user_auth.models.language import EmployeeLanguage, LanguageLevel
from user_auth.serializers.language import (
    EmployeeLanguageSerializer,
    LanguageLevelSerializer,
    EmployeeLanguageCreateSerializer,
)
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYEE_ROLE

from user_auth.utils import load_languages


class EmployeeLanguagesView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get(self, request):
        try:
            profile = request.user.employee_profile
        except EmployeeProfile.DoesNotExist:
            return Response(PROFILE_NOT_FOUND, status=404)

        languages = EmployeeLanguage.objects.filter(employee=profile)
        serializer = EmployeeLanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LanguageLevelsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        levels = LanguageLevel.objects.all()
        serializer = LanguageLevelSerializer(levels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LanguagesListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        idiomas = load_languages()
        return Response(idiomas, status=status.HTTP_200_OK)


class EmployeeLanguagesBulkUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def put(self, request):
        try:
            profile = request.user.employee_profile
        except EmployeeProfile.DoesNotExist:
            return Response(PROFILE_NOT_FOUND, status=404)

        # Eliminar todos los idiomas previos
        EmployeeLanguage.objects.filter(employee=profile).delete()

        # Crear los nuevos idiomas enviados
        languages_data = (
            request.data if isinstance(request.data, list)
            else request.data.get('languages', [])
        )
        created = []
        errors = []
        for lang in languages_data:
            serializer = EmployeeLanguageCreateSerializer(data=lang)
            if serializer.is_valid():
                serializer.save(employee=profile)
                created.append(serializer.data)
            else:
                errors.append(serializer.errors)
        if errors:
            return Response(
                {'created': created, 'errors': errors},
                status=status.HTTP_207_MULTI_STATUS
            )
        return Response(created, status=status.HTTP_200_OK)
