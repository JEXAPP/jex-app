
from django.db.models import OuterRef, Subquery
from django.utils import timezone
from vacancies.models.shifts import Shift
from vacancies.constants import VacancyStates
from vacancies.utils import is_event_near

class VacancyListService:

    @staticmethod
    def get_base_queryset():
        """
        Devuelve un queryset con 1 turno representativo por evento:
        - Vacantes activas
        - Turnos futuros (start_date >= hoy)
        - El turno con mayor pago
        """
        today = timezone.now().date()

        best_shift_per_event = Shift.objects.filter(
            vacancy__event=OuterRef('vacancy__event'),
            vacancy__state__name=VacancyStates.ACTIVE.value,
            start_date__gte=today
        ).order_by('-payment', 'start_date')  # primero pago alto, luego más próximo

        qs = Shift.objects.filter(
            id=Subquery(best_shift_per_event.values('id')[:1])
        ).select_related(
            'vacancy__event',
            'vacancy__event__event_image',
            'vacancy__job_type'
        ).order_by('vacancy__event__id')

        return qs

    @staticmethod
    def filter_by_interests(queryset, user):
        employee = getattr(user, 'employee_profile', None)
        if not employee or not employee.job_types.exists():
            return queryset

        return queryset.filter(
            vacancy__job_type__in=employee.job_types.all()
        ).distinct()

    @staticmethod
    def filter_by_soon(queryset):
        """
        Ordena los turnos por fecha de inicio más próxima
        """
        return queryset.order_by('start_date')
    

    @staticmethod
    def filter_by_nearby(queryset, user):
        employee = getattr(user, 'employee_profile', None)
        if not employee or employee.latitude is None or employee.longitude is None:
            return queryset

        employee_lat = float(employee.latitude)
        employee_lon = float(employee.longitude)

        # Esta parte sigue siendo ineficiente: filtrado en Python, sin paginación ni DB optimizada
        nearby_shifts = [shift for shift in queryset if is_event_near(employee_lat, employee_lon, shift.vacancy.event)]
        return nearby_shifts