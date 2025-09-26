from applications.constants import OfferStates
from user_auth.models.employee import EmployeeProfile
from django.db.models import Q, Count


class EmployeeSearchService:
    """Servicio para manejar la búsqueda y filtrado de empleados"""
    
    @staticmethod
    def get_base_queryset():
        """Obtiene el queryset base con las relaciones optimizadas"""
        return EmployeeProfile.objects.select_related("user").prefetch_related("offers").order_by("id")
    
    @staticmethod
    def filter_by_location(queryset, province=None, locality=None):
        if province:
            queryset = queryset.filter(address__icontains=province)
        
        if locality:
            queryset = queryset.filter(address__icontains=locality)
            
        return queryset
    
    @staticmethod
    def filter_by_availability(queryset, start_date=None, end_date=None, start_time=None, end_time=None):
        if not (start_date and end_date):
            return queryset
            
        # Construir condiciones de exclusión para empleados ocupados
        exclude_conditions = Q(
            offers__state__name=OfferStates.ACCEPTED.value,
            offers__selected_shift__start_date__lte=end_date,
            offers__selected_shift__end_date__gte=start_date,
        )
        
        # Agregar filtros de tiempo si están presentes
        if end_time:
            exclude_conditions &= Q(offers__selected_shift__start_time__lte=end_time)
            
        if start_time:
            exclude_conditions &= Q(offers__selected_shift__end_time__gte=start_time)
        
        return queryset.exclude(exclude_conditions)
    
    @staticmethod
    def filter_by_job_history(queryset, min_jobs=None):
        if min_jobs is None:
            return queryset
            
        return queryset.annotate(
            accepted_jobs=Count(
                "offers", 
                filter=Q(offers__state__name=OfferStates.COMPLETED.value)
            )
        ).filter(accepted_jobs__gte=min_jobs)
    
    @staticmethod 
    def filter_by_rating(queryset, min_rating=None):
        if min_rating is None:
            return queryset
            
        # Ejemplo: suponiendo un campo de rating
        # return queryset.filter(average_rating__gte=min_rating)
        return queryset