from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from applications.serializers.attendance import AttendanceValidationSerializer, AttendanceResponseSerializer, GenerateQRTokenSerializer
from applications.utils import generate_qr_token
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from applications.models.attendance import Attendance



class AttendanceConfirmationView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = AttendanceValidationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        # Creamos la asistencia
        attendance = Attendance.objects.create(
            employee=serializer.validated_data["employee"],
            shift=serializer.validated_data["shift"],
            verified_by=request.user.employer_profile
        )

        response_serializer = AttendanceResponseSerializer(attendance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    


class GenerateQRTokenView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get(self, request, *args, **kwargs):
        offer_id = self.kwargs.get("offer_id")
        serializer = GenerateQRTokenSerializer(data={"offer_id": offer_id}, context={"request": request})
        serializer.is_valid(raise_exception=True)
        offer = serializer.get_offer()

        # Generamos token usando la función utils
        token = generate_qr_token(offer.id, offer.employee.id)

        return Response({"qr_token": token}, status=status.HTTP_200_OK)