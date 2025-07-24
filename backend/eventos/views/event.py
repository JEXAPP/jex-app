from django.utils import timezone
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from django.db.models import Q
from rest_framework import permissions, status
from eventos.serializers.event import CreateEventSerializer
from user_auth.permissions import IsInGroup
from eventos.models.event import Event

class CreateEventView(CreateAPIView):
    serializer_class = CreateEventSerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]
