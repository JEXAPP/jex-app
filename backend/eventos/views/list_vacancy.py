from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from eventos.models.event import Event
from eventos.serializers.list_vacancy import EventWithVacanciesSerializer
from user_auth.permissions import IsInGroup  # Suponiendo que la tenés definida
from rest_framework.exceptions import NotFound


class EventVacanciesView(RetrieveAPIView):
    serializer_class = EventWithVacanciesSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = ["employer"]

    def get_object(self):
        user = self.request.user
        event_id = self.kwargs.get('event_id')

        try:
            return Event.objects.prefetch_related(
                'vacancies',
                'vacancies__job_type',
                'vacancies__state'
            ).get(id=event_id, owner=user)
        except Event.DoesNotExist:
            raise NotFound(detail="El evento no existe o no pertenece al usuario.")

