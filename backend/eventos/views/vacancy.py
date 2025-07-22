from rest_framework.generics import CreateAPIView
from eventos.serializers.vacancy import VacancySerializer
from user_auth.permissions import IsInGroup

class CreateVacancyView(CreateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]

    def perform_create(self, serializer):
        serializer.save()