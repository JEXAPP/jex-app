from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
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
        serializer.save()
        return Response(status=status.HTTP_200_OK)
