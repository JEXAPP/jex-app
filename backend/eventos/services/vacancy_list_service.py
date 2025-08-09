
from django.db.models import OuterRef, Subquery
from django.utils import timezone
from eventos.models.shifts import Shift
from eventos.constants import VacancyStates
from eventos.utils import is_event_near

class VacancyListService:
    @staticmethod
    def get_base_queryset():
        today = timezone.now().date()

        # Subquery: el turno con mayor pago para cada evento, solo vacantes activas y turno >= hoy
        best_shift_per_event = Shift.objects.filter(
            vacancy__event=OuterRef('vacancy__event'),
            vacancy__state__name=VacancyStates.ACTIVE.value,
            start_date__gte=today
        ).order_by('-payment')

        # Queryset base: solo esos turnos, prefetch optimizados
        qs = Shift.objects.filter(
            id=Subquery(best_shift_per_event.values('id')[:1])
        ).select_related(
            'vacancy__event',
            'vacancy__job_type'
        ).order_by('vacancy__event__id')

        return qs

    @staticmethod
    def filter_by_interests(queryset, user):
        employee = getattr(user, 'employee', None)
        if not employee or not employee.job_types.exists():
            return queryset

        # Evito distinct si es posible, pero si hay joins repetidos lo dejo
        return queryset.filter(
            vacancy__job_type__in=employee.job_types.all()
        ).distinct()

    @staticmethod
    def filter_by_soon():
        today = timezone.now().date()
        soon_limit = today + timezone.timedelta(days=7)

        soonest_shift_subquery = Shift.objects.filter(
            vacancy__event=OuterRef('vacancy__event'),
            start_date__range=(today, soon_limit),
            vacancy__state__name=VacancyStates.ACTIVE.value
        ).order_by('start_date')

        return Shift.objects.filter(
            id=Subquery(soonest_shift_subquery.values('id')[:1])
        ).select_related(
            'vacancy__event',
            'vacancy__job_type'
        ).order_by('start_date')

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