from eventos.constants import ORDERING_MAP, Unaccent, VacancyStates
from eventos.models.vacancy import Vacancy
from datetime import datetime


class VacancySearchService:

    @staticmethod
    def get_base_queryset():
        return Vacancy.objects.select_related('event', 'job_type').prefetch_related('shifts').filter(
            state__name=VacancyStates.ACTIVE.value
        )

    @staticmethod
    def filter_by_role(queryset, role_ids):
        return queryset.filter(job_type__id__in=role_ids)

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