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
    required_groups = [EMPLOYER_ROLE]
    serializer_class = OfferConsultSerializer

    def get_queryset(self):
        user = self.request.user
        return Offer.objects.select_related(
            'application__shift__vacancy__event',
            'application__employee__user'
        ).filter(
            employee__user=user,
            application__shift__vacancy__event__start_date__gte=timezone.now().date(),
            state=OfferStates.PENDING.value
        )

class DecideOfferView(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    serializer_class = OfferDecisionSerializer
    lookup_url_kwarg = 'offer_id'

    def get_queryset(self):
        return Offer.objects.filter(state=OfferStates.PENDING.value)  
    def get_object(self):
        offer = super().get_object()
        if offer.employee.user != self.request.user:
            raise PermissionDenied(NOT_PERMISSIONS_OFFER)
        return offer