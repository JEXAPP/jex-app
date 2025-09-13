from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from applications.constants import OfferStates
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from applications.serializers.attendance import AttendanceValidationSerializer, AttendanceResponseSerializer
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from applications.models.attendance import Attendance


class AttendanceConfirmationView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = AttendanceValidationSerializer
    lookup_url_kwarg = "offer_id"

    def create(self, request, *args, **kwargs):
        offer_id = self.kwargs[self.lookup_url_kwarg]

        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        offer = get_object_or_404(
            Offer.objects.select_related("selected_shift__vacancy__event", "employee"),
            pk=offer_id,
            state=state_accepted
        )

        # Pasamos la oferta al serializer por context
        serializer = self.get_serializer(data={}, context={"request": request, "offer": offer})
        serializer.is_valid(raise_exception=True)

        attendance = Attendance.objects.create(
            employee=serializer.validated_data["employee"],
            shift=serializer.validated_data["shift"],
            verified_by=request.user.employer_profile
        )
        response_serializer = AttendanceResponseSerializer(attendance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
