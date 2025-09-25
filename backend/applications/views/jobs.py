from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from applications.constants import OfferStates
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from eventos.constants import EventStates
from eventos.models.event import Event
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.permissions import IsInGroup
from applications.serializers.jobs import EmployeeAcceptedEventsSerializer, EmployeeForSearchSerializer

class EmployeeJobsView(ListAPIView):
    serializer_class = EmployeeForSearchSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get_queryset(self):
        employee = self.request.user.employee_profile
        return Offer.objects.filter(
            employee=employee,
            state__name=OfferStates.ACCEPTED.value
        ).select_related(
            "selected_shift",
            "selected_shift__vacancy",
            "selected_shift__vacancy__job_type",
            "selected_shift__vacancy__event",
            "selected_shift__vacancy__event__state"
        )


class ListAcceptedEventsByEmployeeView(ListAPIView):
    """
    Lista los eventos aceptados por el empleado autenticado.
    """
    serializer_class = EmployeeAcceptedEventsSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get_queryset(self):
        employee = self.request.user.employee_profile
        accepted_state = OfferState.objects.get(name=OfferStates.ACCEPTED.value)
        event_states_accepted = [
            EventStates.PUBLISHED.value,
            EventStates.IN_PROGRESS.value,
        ]

        return Event.objects.filter(
            vacancies__shifts__offers__employee=employee,
            vacancies__shifts__offers__state=accepted_state,
            state__name__in=event_states_accepted,
        ).distinct()