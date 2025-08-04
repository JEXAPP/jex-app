from datetime import datetime
import json
from django.forms import ValidationError
from django.utils import timezone
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from config.pagination import CustomPagination
from eventos.models.shifts import Shift
from eventos.models.vacancy import Vacancy
from eventos.serializers.vacancy import ListVacancyShiftSerializer, SearchVacancyParamsSerializer, SearchVacancyResultSerializer, VacancyDetailSerializer, VacancySerializer
from rest_framework import permissions, serializers, status
from user_auth.permissions import IsInGroup
from django.db.models import OuterRef, Subquery
from rest_framework.response import Response
from django.db.models import Q
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from eventos.utils import is_event_near
from rest_framework.exceptions import NotFound
from eventos.constants import ORDERING_MAP, Unaccent


class CreateVacancyView(CreateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class UpdateVacancyView(UpdateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        # Solo vacantes de eventos cuyo owner es el usuario autenticado
        return Vacancy.objects.filter(event__owner=self.request.user)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class ListVacancyShiftView(ListAPIView):
    serializer_class = ListVacancyShiftSerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    pagination_class = CustomPagination

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

        return base_qs

    def _filter_by_interests(self, base_qs, user):
        employee = getattr(user, 'employee', None)
        if not employee or not employee.job_types.exists():
            return base_qs
        return base_qs.filter(
            vacancy__job_type__in=employee.job_types.all()
        ).distinct()

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
            ).order_by('start_date')

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
            ]


class SearchVacancyView(ListAPIView):
    serializer_class = SearchVacancyResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    pagination_class = CustomPagination

    def get_queryset(self):
        choice = self.request.query_params.get('choice')
        if not choice:
            raise ValidationError({"choice": "Este campo es requerido."})

        raw_value = self.request.query_params.get('value')
        if raw_value is None:
            raise ValidationError({"value": "Este campo es requerido."})

        # Parseo especial para choice == 'role' porque viene un array JSON en string
        if choice == 'role':
            try:
                # Parsear el JSON
                parsed_value = json.loads(raw_value)
            except json.JSONDecodeError:
                raise ValidationError({"value": "Debe enviar un JSON válido para la lista de roles."})

            params_data = {
                "choice": choice,
                "value": parsed_value,
            }
        else:
            # Para los otros casos, el value queda como string
            params_data = {
                "choice": choice,
                "value": raw_value,
            }

        params = SearchVacancyParamsSerializer(data=params_data)
        params.is_valid(raise_exception=True)

        value = params.validated_data['value']

        qs = Vacancy.objects.select_related('event', 'job_type').prefetch_related('shifts')

        if choice == 'role':
            qs = qs.filter(job_type__id__in=value)

        elif choice == 'event':
            qs = qs.annotate(unaccented_event=Unaccent('event__name')).filter(unaccented_event__icontains=value)

        elif choice == 'start_date':
            date_obj = datetime.strptime(value, '%d/%m/%Y').date()
            qs = qs.filter(shifts__start_date=date_obj).distinct()

        order_key = self.request.query_params.get('order_by')
        order_field = ORDERING_MAP.get(order_key)
        if order_field:
            qs = qs.order_by(order_field)
        else:
            qs = qs.order_by('id')

        return qs
    

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