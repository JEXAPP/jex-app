from vacancies.constants import ORDERING_MAP, Unaccent, VacancyStates
from vacancies.models.vacancy import Vacancy
from datetime import datetime
from django.db.models import Q


class VacancySearchService:

    @staticmethod
    def get_base_queryset():
        return Vacancy.objects.select_related('event', 'job_type', 'state').prefetch_related('shifts').filter(
            state__name=VacancyStates.ACTIVE.value
        )
    
    @staticmethod
    def filter_by_role(queryset, search_value):            
        return queryset.annotate(
            unaccented_job_type=Unaccent('job_type__name'),
            unaccented_specific_job=Unaccent('specific_job_type')
        ).filter(
            Q(unaccented_job_type__icontains=search_value) | 
            Q(unaccented_specific_job__icontains=search_value)
        )

    @staticmethod
    def filter_by_event(queryset, event_name):
        return queryset.annotate(
            unaccented_event=Unaccent('event__name')
        ).filter(unaccented_event__icontains=event_name)
    
    @staticmethod
    def filter_by_start_date(queryset, start_date_str):
        date_obj = datetime.strptime(start_date_str, '%d/%m/%Y').date()
        return queryset.filter(shifts__start_date=date_obj).distinct()

    @staticmethod
    def order_queryset(queryset, order_key):
        order_field = ORDERING_MAP.get(order_key)
        if order_field:
            return queryset.order_by(order_field)
        return queryset.order_by('id')