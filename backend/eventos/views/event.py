from django.shortcuts import get_object_or_404
from applications.models.applications import Application
from payments.models.payments import Payment
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    ValidationError,
) 
from applications.constants import ApplicationStates, OfferStates
from applications.models.offer_state import OfferState
from eventos.constants import EventStates
from eventos.errors.events_messages import (
    ESTADO_DELETED_NO_CONFIGURADO,
    EVENT_NOT_FOUND,
    NO_EDITAR_EVENTO_PUBLICADO,
    NO_PERMISSION_EVENT,
    STATE_UPDATED_SUCCESS,
)
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.serializers.event import (
    CreateEventSerializer,
    CreateEventResponseSerializer,
    EventReportSerializer,
    ListActiveEventsSerializer,
    ListEventDetailSerializer,
    ListEventVacanciesSerializer,
    ListEventsByEmployerSerializer,
    ListEventsEmployeeSerializer,
    ListEventsWithVacanciesSerializer,
    ListHistoryEventsViewSerializer,
    UpdateEventStateSerializer,
    ListEventsEmployeeSerializer,
)
from rating.models.rating import Rating
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from applications.models import Offer
from datetime import date
from django.db.models import (
    Q,
    Case,
    Count,
    DateField,
    Exists,
    OuterRef,
    When,
    Value,
    IntegerField,
    F,
)
from django.db.models.functions import ExtractDay
from django.db.models.functions import Abs


from vacancies.constants import VacancyStates
from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from django.db.models import Prefetch


class CreateEventView(CreateAPIView):
    """
    Crea un evento para el empleador autenticado.
    """

    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = CreateEventSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = self.request.user
        return context

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos para devolver el serializer de salida.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(owner=request.user)

        response_serializer = CreateEventResponseSerializer(event)
        return Response(response_serializer.data, status=201)


class ListActiveEventsView(ListAPIView):
    """
    Listar eventos activos
    """

    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]
    serializer_class = ListActiveEventsSerializer

    queryset = Event.objects.all().filter(state__name=EventStates.PUBLISHED.value)


class ListEventDetailView(RetrieveAPIView):
    serializer_class = ListEventDetailSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]
    lookup_field = "pk"

    def get_queryset(self):
        return Event.objects.all()


class UpdateEventView(UpdateAPIView):
    serializer_class = CreateEventSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Event.objects.all()
        return Event.objects.filter(owner=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = self.request.user
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        published_state = EventState.objects.get(name=EventStates.PUBLISHED.value)
        if instance.state == published_state:
            return Response(NO_EDITAR_EVENTO_PUBLICADO, status=400)
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response_serializer = CreateEventResponseSerializer(instance)
        return Response(response_serializer.data)


class ListEventVacanciesView(ListAPIView):
    serializer_class = ListEventVacanciesSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE, EMPLOYEE_ROLE]

    def get_queryset(self):
        shifts_qs = Shift.objects.annotate(
            quantity_offers=Count(
                "selected_offers",
                filter=Q(
                    selected_offers__state__name__in=[
                        OfferStates.PENDING.value,
                        OfferStates.ACCEPTED.value,
                    ]
                ),
                distinct=True,
            ),
            has_pending_application=Exists(
                Application.objects.filter(
                    shift=OuterRef("pk"),
                    state__name=ApplicationStates.PENDING.value,
                ),
            ),
        )

        vacancies_qs = (
            Vacancy.objects.filter(state__name=VacancyStates.ACTIVE.value)
            .select_related("job_type")
            .prefetch_related(Prefetch("shifts", queryset=shifts_qs))
            .annotate(
                has_active_application=Exists(
                    Application.objects.filter(
                        shift__vacancy=OuterRef("pk"),
                        state__name=ApplicationStates.PENDING.value,
                    )
                )
            )
        )

        return (
            Event.objects.filter(
                owner=self.request.user, state__name=EventStates.PUBLISHED.value
            )
            .select_related("state")
            .prefetch_related(Prefetch("vacancies", queryset=vacancies_qs))
        )


class UpdateEventStateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def patch(self, request, pk):
        serializer = UpdateEventStateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            event = Event.objects.select_related("state", "owner").get(id=pk)
        except Event.DoesNotExist:
            return Response(
                {"detail": EVENT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND
            )

        if event.owner != request.user:
            return Response(
                {"detail": NO_PERMISSION_EVENT}, status=status.HTTP_403_FORBIDDEN
            )

        new_state_id = serializer.validated_data["state_id"]
        new_state = EventState.objects.get(id=new_state_id)

        event.state = new_state
        event.save()

        return Response({"detail": STATE_UPDATED_SUCCESS}, status=status.HTTP_200_OK)


class DeleteEventView(APIView):
    """
    Elimina lógicamente un evento cambiando su estado a 'DELETED'.
    """

    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def delete(self, request, pk):
        try:
            event = Event.objects.select_related("state", "owner").get(id=pk)
        except Event.DoesNotExist:
            return Response(EVENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        if event.owner != request.user:
            return Response(NO_PERMISSION_EVENT, status=status.HTTP_403_FORBIDDEN)

        try:
            deleted_state = EventState.objects.get(name=EventStates.DELETED.value)
        except EventState.DoesNotExist:
            return Response(
                ESTADO_DELETED_NO_CONFIGURADO,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        event.state = deleted_state
        event.save()

        return Response(
            {"detail": "Evento eliminado correctamente."}, status=status.HTTP_200_OK
        )


class ListEventsByEmployerView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ListEventsByEmployerSerializer

    DEFAULT_STATE_IDS = [1, 2, 3, 4, 5, 6]

    VALID_STATE_IDS = {1, 2, 3, 4, 5, 6}

    def get_state_ids(self):
        params = self.request.query_params.getlist("state")

        if not params:
            return self.DEFAULT_STATE_IDS

        state_ids = set()
        for raw in params:
            try:
                sid = int(raw)
            except ValueError:
                raise ValidationError(
                    {"state": f"'{raw}' no es un ID de estado válido."}
                )

            if sid not in self.VALID_STATE_IDS:
                raise ValidationError({"state": f"El estado con ID {sid} no existe."})

            state_ids.add(sid)

        return state_ids

    def get_queryset(self):
        state_ids = self.get_state_ids()

        payments_prefetch = Prefetch(
            "vacancies__shifts__selected_offers__payment_set",
            queryset=Payment.objects.select_related("state"),
        )

        return (
            Event.objects.filter(
                owner=self.request.user,
                state__id__in=state_ids,
            )
            .select_related("state")
            .prefetch_related(payments_prefetch)
            .annotate(
                state_priority=Case(
                    When(state__id=3, then=Value(1)),
                    When(state__id=2, then=Value(2)),
                    When(state__id=1, then=Value(3)),
                    When(state__id=4, then=Value(4)),
                    default=Value(99),
                    output_field=IntegerField(),
                ),
                sort_date_asc=Case(
                    When(state__id=4, then=Value(None)),
                    default=F("start_date"),
                    output_field=DateField(),
                ),
                sort_date_desc=Case(
                    When(state__id=4, then=F("end_date")),
                    default=Value(None),
                    output_field=DateField(),
                ),
            )
            .order_by(
                "state_priority",
                F("sort_date_asc").asc(nulls_last=True),
                F("sort_date_desc").desc(nulls_last=True),
            )
        )


class ListEventsWithVacanciesView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ListEventsWithVacanciesSerializer

    def get_queryset(self):
        user = self.request.user

        active_vacancies_qs = Vacancy.objects.filter(
            state__name=VacancyStates.ACTIVE.value
        )

        return (
            Event.objects.filter(
                owner=user,
                state__name=EventStates.PUBLISHED.value,
                vacancies__in=active_vacancies_qs,
            )
            .distinct()
            .prefetch_related(Prefetch("vacancies", queryset=active_vacancies_qs))
        )


class ListEventsEmployeeView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ListEventsEmployeeSerializer

    def get_queryset(self):
        request = self.request
        rater = request.user  # el empleador actual
        event_id = self.kwargs.get("eventId")

        states_to_include = OfferState.objects.filter(
            name__in=[OfferStates.COMPLETED.value, OfferStates.NOT_SHOWN.value]
        )

        # Ofertas del evento con esos estados
        qs = Offer.objects.filter(
            selected_shift__vacancy__event_id=event_id, state__in=states_to_include
        ).select_related(
            "employee",
            "employee__user",
            "selected_shift",
            "selected_shift__vacancy",
            "selected_shift__vacancy__event",
        )

        # Empleados (usuarios) que ya fueron calificados por este empleador en este evento
        rated_employee_ids = Rating.objects.filter(
            rater=rater, event_id=event_id
        ).values_list("behavior__user_id", flat=True)

        # Excluir empleados ya calificados
        qs = qs.exclude(employee__user_id__in=rated_employee_ids)

        return qs


class ReportEventView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get(self, request, event_id, *args, **kwargs):
        event = get_object_or_404(Event, id=event_id)
        serializer = EventReportSerializer(event)
        return Response(serializer.data)


class ListHistoryEventsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ListHistoryEventsViewSerializer
    historical_states = [
        EventStates.FINALIZED.value,
    ]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(owner=user, state__name__in=self.historical_states)
