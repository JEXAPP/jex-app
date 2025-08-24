from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from applications.constants import OfferStates
from applications.serializers.offer import OfferCreateSerializer, OfferConsultSerializer, OfferDecisionSerializer
from rest_framework import permissions
from django.utils import timezone
from applications.models.offers import Offer
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from rest_framework.exceptions import PermissionDenied
from applications.errors.offer_messages import NOT_PERMISSIONS_OFFER
from applications.models.offer_state import OfferState
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status


class OfferCreateView(CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = OfferCreateSerializer


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        context['application_id'] = self.kwargs['application_id']
        return context

class OfferConsultView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
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
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
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