from rest_framework.generics import CreateAPIView
from eventos.serializers.event import CreateEventSerializer
from user_auth.permissions import IsInGroup

class CreateEventView(CreateAPIView):
    serializer_class = CreateEventSerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]
