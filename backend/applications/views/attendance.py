from rest_framework.generics import CreateAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from applications.serializers.attendance import AttendanceValidationSerializer, AttendanceResponseSerializer, QRPermissionToggleSerializer
from user_auth.constants import EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from applications.models.attendance import Attendance


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
    

class QRPermissionToggleView(CreateAPIView):
    serializer_class = QRPermissionToggleSerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def create(self, request, *args, **kwargs):
        data = {
            "shift_id": self.kwargs.get("shift_id"),
            "action": self.kwargs.get("action")
        }
        serializer = self.get_serializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        shift = serializer.save()
        return Response({
            "shift_id": shift.id,
            "qr_enabled": shift.qr_enabled
        }, status=status.HTTP_200_OK)