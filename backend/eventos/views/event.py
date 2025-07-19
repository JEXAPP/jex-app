from django.utils import timezone
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from django.db.models import Q
from rest_framework import permissions
from eventos.serializers.event import EventSerializer
from user_auth.permissions import IsInGroup
from eventos.models.event import Event

class CreateEventView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]


class EventListView(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventDetailView(RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class UpcomingEventsView(ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        now = timezone.localtime()
        today = now.date()
        current_time = now.time()

        return Event.objects.filter(
            Q(start_date__gt=today) | 
            Q(start_date=today, start_time__gte=current_time)
        )