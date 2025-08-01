from datetime import datetime
from django.utils import timezone
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.serializers.vacancy import CreateVacancySerializer, ListVacancyShiftSerializer, SearchVacancyParamsSerializer, SearchVacancyResultSerializer, VacancyDetailSerializer
from rest_framework import permissions, serializers, status
from user_auth.permissions import IsInGroup
from django.db.models import OuterRef, Subquery
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from eventos.utils import is_event_near
from rest_framework.exceptions import NotFound


class CreateVacancyView(CreateAPIView):
    serializer_class = CreateVacancySerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListVacancyShiftView(ListAPIView):
    serializer_class = ListVacancyShiftSerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')

        # Subquery: para cada evento, buscar el turno con mayor pago
        best_shift_per_event = Shift.objects.filter(
            vacancy__event=OuterRef('vacancy__event')
        ).order_by('-payment')

        # Base queryset: uno por evento, el turno mejor pago del evento
        base_qs = Shift.objects.filter(
            id=Subquery(best_shift_per_event.values('id')[:1])
        ).select_related(
            'vacancy__event',
            'vacancy__job_type'
        ).order_by('vacancy__event__id')

        if category == 'interests':
            return self._filter_by_interests(base_qs, user)

        elif category == 'soon':
            return self._filter_by_soon(base_qs)
        
        elif category == 'nearby':
            return self._filter_by_nearby(base_qs, user)
        
        elif category is not None and category != '' and category not in ['interests', 'soon', 'nearby']:
            raise serializers.ValidationError("Invalid category. Must be 'interests', 'soon', or 'nearby'.")

        return base_qs[:10]

    def _filter_by_interests(self, base_qs, user):
        employee = getattr(user, 'employee', None)
        if not employee or not employee.job_types.exists():
            return base_qs
        return base_qs.filter(
            vacancy__job_type__in=employee.job_types.all()
        ).distinct()[:10]

    def _filter_by_soon(self, base_qs):
        today = timezone.now().date()
        soon_limit = today + timezone.timedelta(days=7)

        soonest_shift_subquery = Shift.objects.filter(
        vacancy__event=OuterRef('vacancy__event'),
        start_date__range=(today, soon_limit)).order_by('start_date')

        base_qs = Shift.objects.filter(
                id=Subquery(soonest_shift_subquery.values('id')[:1])
            ).select_related(
                'vacancy__event',
                'vacancy__job_type'
            ).order_by('start_date')[:10]

        return base_qs
    
    def _filter_by_nearby(self, base_qs, user):
        employee = getattr(user, 'employee_profile', None)
        if not employee or not employee.latitude or not employee.longitude:
            return base_qs

        employee_lat = float(employee.latitude)
        employee_lon = float(employee.longitude)

        return [
            shift for shift in base_qs
            if is_event_near(employee_lat, employee_lon, shift.vacancy.event)
            ][:10]


class SearchVacancyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]


    def get(self, request):
        param_serializer = SearchVacancyParamsSerializer(data=request.query_params)
        param_serializer.is_valid(raise_exception=True)

        choice = param_serializer.validated_data['choice']
        value = param_serializer.validated_data['value']

        vacancies = Vacancy.objects.select_related('event', 'job_type').prefetch_related('shifts')

        if choice == 'role':
            vacancies = vacancies.filter(
                Q(job_type__name__icontains=value) | Q(specific_job_type__icontains=value)
            )
        elif choice == 'event':
            vacancies = vacancies.filter(event__name__icontains=value)
        elif choice == 'start_date':
            date_obj = datetime.strptime(value, '%d/%m/%Y').date()
            vacancies = vacancies.filter(shifts__start_date=date_obj).distinct()

        serializer = SearchVacancyResultSerializer(vacancies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class VacancyDetailView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VacancyDetailSerializer

    def get_queryset(self):
        return Vacancy.objects.select_related(
            'event__owner__profile_image',
            'event__category',
            'event__state',
            'job_type',
            'state'
        ).prefetch_related(
            'shifts',
            'requirements'
        )

    def get_object(self):
        try:
            return self.get_queryset().get(pk=self.kwargs['pk'])
        except Vacancy.DoesNotExist:
            raise NotFound(detail="Vacante no encontrada.")