from django.utils import timezone
from rest_framework.generics import CreateAPIView, ListAPIView
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.serializers.vacancy import CreateVacancySerializer, ListVacancyShiftSerializer
from rest_framework import permissions
from user_auth.permissions import IsInGroup
from django.db.models import OuterRef, Subquery, DecimalField, DateField


class CreateVacancyView(CreateAPIView):
    serializer_class = CreateVacancySerializer
    permission_classes = [IsInGroup]
    required_groups = ["employer"]


class ListVacancyShiftView(ListAPIView):
    serializer_class = ListVacancyShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')

        
        best_shifts = Shift.objects.filter(
            vacancy=OuterRef('vacancy')
        ).order_by('-payment')

        base_qs = Shift.objects.filter(
            id=Subquery(best_shifts.values('id')[:1])
        ).select_related(
            'vacancy__event',
            'vacancy__job_type'
        ).order_by('vacancy__id') 


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