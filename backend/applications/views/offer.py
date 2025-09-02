from rest_framework.generics import CreateAPIView, ListAPIView
from applications.constants import OfferStates
from applications.serializers.offer import OfferAcceptedDetailSerializer, OfferCreateSerializer, OfferConsultSerializer, OfferDecisionSerializer, OfferDetailSerializer, OfferEventByStateSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from applications.models.offers import Offer
from eventos.models.event import Event
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.models.employee import EmployeeProfile
from user_auth.permissions import IsInGroup
from rest_framework.exceptions import PermissionDenied
from applications.errors.offer_messages import NOT_PERMISSION_ACCEPTED_OFFER, NOT_PERMISSIONS_OFFER
from applications.models.offer_state import OfferState
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView

from user_auth.serializers.employee import EmployeeForSearchSerializer

class OfferCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = OfferCreateSerializer


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        context['application_id'] = self.kwargs['application_id']
        return context

class OfferConsultView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    serializer_class = OfferConsultSerializer

    def get_queryset(self):
        user = self.request.user
        state_pending = OfferState.objects.get(name=OfferStates.PENDING.value)
        return Offer.objects.select_related(
            'application__shift__vacancy__event',
            'application__employee__user'
        ).filter(
            employee__user=user,
            application__shift__vacancy__event__start_date__gte=timezone.now().date(),
            state=state_pending
        )

class DecideOfferView(CreateAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    serializer_class = OfferDecisionSerializer
    lookup_url_kwarg = 'offer_id'

    def get_object(self):
        offer = get_object_or_404(Offer, pk=self.kwargs[self.lookup_url_kwarg])
        if offer.employee.user != self.request.user:
            raise PermissionDenied(NOT_PERMISSIONS_OFFER)
        return offer

    def create(self, request, *args, **kwargs):
        offer = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'offer': offer, 'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Offer decision saved successfully.'}, status=status.HTTP_200_OK)
    
class OfferDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    serializer_class = OfferDetailSerializer
    queryset = Offer.objects.select_related(
        'application__shift__vacancy__event',
        'application__employee__user'
)
    
class ListOfferEventByState(ListAPIView):
    serializer_class = OfferEventByStateSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        event_id = self.kwargs.get("event_id")
        state_id = self.kwargs.get("state_id")

        event = get_object_or_404(Event, id=event_id)

        return (
            Offer.objects.filter(
                selected_shift__vacancy__event=event,
                state_id=state_id
            )
            .select_related(
                "employee__user",
                "selected_shift__vacancy__job_type",
                "selected_shift__vacancy__event",
                "state"
            )
        )

    

class OfferAcceptedDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    serializer_class = OfferAcceptedDetailSerializer
    lookup_url_kwarg = "shift_id"

    def get_object(self):
        user = self.request.user
        shift_id = self.kwargs[self.lookup_url_kwarg]

        # buscamos estado ACCEPTED
        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)

        # buscamos la oferta aceptada del turno para este empleado
        offer = Offer.objects.filter(
            selected_shift_id=shift_id,
            employee__user=user,
            state=state_accepted
        ).select_related("selected_shift__vacancy").first()

        if not offer:
            raise PermissionDenied(NOT_PERMISSION_ACCEPTED_OFFER)

        return offer.selected_shift
    
        

class EmployeeSearchDetailView(RetrieveAPIView):
    serializer_class = EmployeeForSearchSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    lookup_url_kwarg = "employee_id"

    def get_queryset(self):
        return EmployeeProfile.objects.select_related("user", "user__profile_image").prefetch_related("job_types")

    def get_object(self):
        employee_id = self.kwargs[self.lookup_url_kwarg]
        employee = get_object_or_404(self.get_queryset(), id=employee_id)

        return employee