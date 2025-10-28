from vacancies.constants import ORDERING_MAP, Unaccent, VacancyStates
from vacancies.models.vacancy import Vacancy
from django.db.models import Q
from unidecode import unidecode
from django.db.models.functions import Lower
from django.db.models import Max, Min


class VacancySearchService:

    @staticmethod
    def get_base_queryset():
        """
        Base: todas las vacantes activas con relaciones necesarias.
        """
        return (
            Vacancy.objects
            .select_related("event", "event__event_image", "job_type", "state")
            .prefetch_related("shifts")
            .filter(state__name=VacancyStates.ACTIVE.value)
        )

    @staticmethod
    def filter_by_roles(queryset, roles):
        """
        Filtra vacantes que coincidan con uno o varios roles (job_type o specific_job_type).
        Ignora mayúsculas/minúsculas y acentos.
        """
        if not roles:
            return queryset

        queryset = queryset.annotate(
            job_type_unaccent=Lower(Unaccent("job_type__name")),
            specific_job_unaccent=Lower(Unaccent("specific_job_type")),
        )

        q_objects = Q()
        for role in roles:
            normalized = unidecode(role).lower().strip()
            if normalized:
                q_objects |= (
                    Q(job_type_unaccent__icontains=normalized) |
                    Q(specific_job_unaccent__icontains=normalized)
                )

        return queryset.filter(q_objects).distinct()

    @staticmethod
    def filter_by_events(queryset, events):
        """
        Filtra vacantes que coincidan con uno o varios nombres de evento.
        Ignora mayúsculas/minúsculas y acentos.
        """
        if not events:
            return queryset

        queryset = queryset.annotate(
            event_unaccent=Lower(Unaccent("event__name")),
        )

        q_objects = Q()
        for event_name in events:
            normalized = unidecode(event_name).lower().strip()
            if normalized:
                q_objects |= Q(event_unaccent__icontains=normalized)

        return queryset.filter(q_objects).distinct()

    @staticmethod
    def filter_by_date_range(queryset, date_from, date_to):
        """
        Filtra vacantes que tienen turnos en el rango de fechas especificado.
        Si date_to es None, busca solo en date_from.
        """
        if not date_from:
            return queryset

        if date_to is None:
            date_to = date_from

        return queryset.filter(
            shifts__start_date__gte=date_from,
            shifts__start_date__lte=date_to
        ).distinct()

    @staticmethod
    def order_queryset(queryset, order_key):
        """
        Ordena el queryset según un campo permitido en ORDERING_MAP.
        Soporta agregación para campos relacionados (shifts__payment, shifts__start_date)
        """
        order_field = ORDERING_MAP.get(order_key)
        if not order_field:
            return queryset.order_by("id")  # orden por defecto

        # Ordenamiento por payment
        if "payment" in order_field:
            queryset = queryset.annotate(max_payment=Max("shifts__payment"))
            if order_field.startswith("-"):
                return queryset.order_by("-max_payment")
            return queryset.order_by("max_payment")

        # Ordenamiento por start_date
        if "start_date" in order_field:
            queryset = queryset.annotate(min_start=Min("shifts__start_date"))
            if order_field.startswith("-"):
                return queryset.order_by("-min_start")
            return queryset.order_by("min_start")

        # Ordenamiento por otros campos normales
        return queryset.order_by(order_field)