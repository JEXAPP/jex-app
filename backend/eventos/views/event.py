from django.utils import timezone
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from django.db.models import Q
from rest_framework import permissions, status
from eventos.serializers.event import EventSerializer
from user_auth.permissions import IsInGroup
from eventos.models.event import Event

class CreateEventView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]

    def perform_create(self, serializer):
        self.event = serializer.save()

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({
            "id": self.event.id,
            "description": self.event.description
        }, status=status.HTTP_201_CREATED)


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
    