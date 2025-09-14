from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from eventos.constants import EventStates
from eventos.errors.events_messages import ESTADO_DELETED_NO_CONFIGURADO, EVENT_NOT_FOUND, NO_PERMISSION_EVENT, STATE_UPDATED_SUCCESS
from eventos.models.event import Event
from eventos.models.state_events import EventState
from eventos.serializers.event import CreateEventSerializer, CreateEventResponseSerializer, ListActiveEventsSerializer, ListEventDetailSerializer, ListEventVacanciesSerializer, ListEventsByEmployerSerializer, ListEventsWithVacanciesSerializer, UpdateEventStateSerializer
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from user_auth.permissions import IsInGroup
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


from vacancies.constants import VacancyStates
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
        context['user'] = self.request.user
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
        context['user'] = self.request.user
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response_serializer = CreateEventResponseSerializer(instance)
        return Response(response_serializer.data)
    
class ListEventVacanciesView(ListAPIView):
    serializer_class = ListEventVacanciesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        vacancies_qs = Vacancy.objects.filter(
            state__name=VacancyStates.ACTIVE.value
        ).select_related("job_type").prefetch_related("shifts")

        return Event.objects.filter(
            owner=user,
            state__name=EventStates.PUBLISHED.value
        ).prefetch_related(
            Prefetch("vacancies", queryset=vacancies_qs)
        )
    
    
class DeleteEventView(APIView):
    """
    Elimina lógicamente un evento cambiando su estado a 'DELETED'.
    """
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def delete(self, request, pk):
        try:
            event = Event.objects.select_related('state', 'owner').get(id=pk)
        except Event.DoesNotExist:
            return Response(EVENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        if event.owner != request.user:
            return Response(NO_PERMISSION_EVENT, status=status.HTTP_403_FORBIDDEN)

        try:
            deleted_state = EventState.objects.get(name=EventStates.DELETED.value)
        except EventState.DoesNotExist:
            return Response(ESTADO_DELETED_NO_CONFIGURADO, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        event.state = deleted_state
        event.save()

        return Response({"detail": "Evento eliminado correctamente."}, status=status.HTTP_200_OK)




class ListEventsByEmployerView(ListAPIView):
    """
    Lista los eventos activos del empleador autenticado.
    """
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = ListEventsByEmployerSerializer
    active_states = [
        EventStates.PUBLISHED.value,
        EventStates.IN_PROGRESS.value,
        EventStates.FINALIZED.value,
    ]

    def get_queryset(self):
        user = self.request.user
        return (
            Event.objects
            .filter(
                owner=user,
                state__name__in=self.active_states
            )
            .only("id", "name", "state")
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
            Event.objects
            .filter(
                owner=user,
                state__name=EventStates.PUBLISHED.value,
                vacancies__in=active_vacancies_qs
            )
            .distinct()
            .prefetch_related(
                Prefetch("vacancies", queryset=active_vacancies_qs)
            )
        )