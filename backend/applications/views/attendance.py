from rest_framework.generics import CreateAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from applications.serializers.attendance import AttendanceValidationSerializer, AttendanceResponseSerializer
from user_auth.constants import EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from applications.models.attendance import Attendance
from datetime import timezone


class AttendanceValidationView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = AttendanceValidationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = Attendance.objects.create(
            employee=serializer.validated_data["employee"],
            shift=serializer.validated_data["shift"],
            verified_by=request.user.employer_profile
        )
        response_serializer = AttendanceResponseSerializer(attendance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
