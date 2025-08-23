from vacancies.constants import ORDERING_MAP, Unaccent, VacancyStates
from vacancies.models.vacancy import Vacancy
from datetime import datetime
from django.db.models import Q
from unidecode import unidecode


class VacancySearchService:

    @staticmethod
    def get_base_queryset():
        return Vacancy.objects.select_related('event', 'job_type', 'state').filter(
            state__name=VacancyStates.ACTIVE.value
        )
    

    @staticmethod
    def filter_by_role(queryset, search_value):
        normalized_search = unidecode(search_value.lower()) if search_value else ""
        filtered_qs = queryset.annotate(
                    unaccented_job_type=Unaccent('job_type__name'),
                    unaccented_specific_job=Unaccent('specific_job_type')
                ).filter(
                    Q(unaccented_job_type__icontains=normalized_search) | 
                    Q(unaccented_specific_job__icontains=normalized_search)
                ).distinct()
                
        # Aplicar prefetch_related después del filtro para evitar duplicados
        return filtered_qs.prefetch_related('shifts')

    @staticmethod
    def filter_by_event(queryset, event_name):
        normalized_search = unidecode(event_name.lower()) if event_name else ""

        filtered_qs = queryset.annotate(
            unaccented_event=Unaccent('event__name')
        ).filter(unaccented_event__icontains=normalized_search).distinct()
        
        # Aplicar prefetch_related después del filtro para evitar duplicados
        return filtered_qs.prefetch_related('shifts')

    @staticmethod
    def filter_by_date_range(queryset, date_from, date_to):
        """
        Filtra vacantes que tienen turnos en el rango de fechas especificado.
        Si date_to es None, busca solo en date_from.
        """
        if date_to is None:
            date_to = date_from
            
        filtered_qs = queryset.filter(
            shifts__start_date__gte=date_from,
            shifts__start_date__lte=date_to
        ).distinct()
        
        # Aplicar prefetch_related después del filtro para evitar duplicados
        return filtered_qs.prefetch_related('shifts')

    @staticmethod
    def order_queryset(queryset, order_key):
        order_field = ORDERING_MAP.get(order_key) if order_key else None
        if order_field:
            return queryset.order_by(order_field)
        return queryset.order_by('id')