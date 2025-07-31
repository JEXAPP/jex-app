from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from eventos.models.event import Event
from eventos.serializers.list_vacancy import EventWithVacanciesSerializer
from user_auth.permissions import IsInGroup  # Suponiendo que la tenés definida
from rest_framework.exceptions import NotFound
from user_auth.constants import EMPLOYER_ROLE

class EmployerEventsWithVacanciesView(ListAPIView):
    serializer_class = EventWithVacanciesSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(owner=user).prefetch_related(
            'vacancies__state',
            'vacancies__job_type'
        )

