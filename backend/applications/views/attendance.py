from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from applications.constants import OfferStates
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from applications.serializers.attendance import AttendanceValidationSerializer, AttendanceResponseSerializer, GenerateQRTokenSerializer, OfferByEventSerializer
from applications.utils import generate_qr_token
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from applications.models.attendance import Attendance
from eventos.models.event import Event



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
    

class AttendanceDetailByEvent(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = OfferByEventSerializer

    def get(self, request, *args, **kwargs):
        event_id = kwargs.get("event_id")
        if not event_id:
            return Response({"detail": "event_id is required"}, status=400)

        # Traemos el evento
        event = get_object_or_404(Event, id=event_id)
        offer_accepted_state = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)

        # Filtramos las offers aceptadas de los shifts de ese evento
        offers = Offer.objects.filter(
            selected_shift__vacancy__event=event,
            state=offer_accepted_state
        ).select_related("employee__user", "selected_shift__vacancy").order_by("selected_shift__start_date", "selected_shift__start_time")

        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data, status=200)