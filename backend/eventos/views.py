from rest_framework import generics
from rest_framework import permissions
from eventos.serializers import EventSerializer
from user_auth.permissions import IsInGroup
from eventos.models import Event


class CreateEventView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsInGroup]
    required_groups = ["empleador"]


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
