from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from eventos.errors.application_messages import ALREADY_APPLIED_ALL_SHIFTS, APPLICATIONS_CREATED_SUCCESS
from eventos.serializers.applications import (
    ApplicationCreateSerializer,
)
from user_auth.permissions import IsInGroup
from user_auth.constants import EMPLOYEE_ROLE


class ApplicationCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def post(self, request):
        serializer = ApplicationCreateSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        created = serializer.save()

        if created is False:
            return Response({"message": ALREADY_APPLIED_ALL_SHIFTS}, status=status.HTTP_200_OK)

        return Response({"message": APPLICATIONS_CREATED_SUCCESS}, status=status.HTTP_201_CREATED)

