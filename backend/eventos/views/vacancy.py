from django.utils import timezone
from rest_framework.generics import CreateAPIView, ListAPIView
from eventos.models.shifts import Shift
from eventos.serializers.vacancy import VacancySerializer, VacancyShiftSerializer
from rest_framework import permissions
from user_auth.permissions import IsInGroup

class CreateVacancyView(CreateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]

    def perform_create(self, serializer):
        serializer.save()


class ListVacancyShiftView(ListAPIView):
    serializer_class = VacancyShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')

        base_qs = Shift.objects.select_related(
            'vacancy__event',
            'vacancy__job_type'
        )

        if category == 'interests':
            employee = getattr(user, 'employee', None)
            if not employee or not employee.job_types.exists():
                return Shift.objects.none()

            return base_qs.filter(
                vacancy__job_type__in=employee.job_types.all()
            )

        elif category == 'soon':
            today = timezone.now().date()
            soon_limit = today + timezone.timedelta(days=7)

            return base_qs.filter(
                start_date__range=(today, soon_limit)
            )

        return base_qs.all()