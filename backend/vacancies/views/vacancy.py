from django.forms import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from config.pagination import CustomPagination
from vacancies.errors.vacancies_messages import VACANCY_NOT_FOUND
from vacancies.models.requirements import Requirements
from vacancies.models.shifts import Shift
from vacancies.models.vacancy import Vacancy
from vacancies.serializers.vacancy import EmployerEventsWithVacanciesSerializer, ListVacancyShiftSerializer, VacancyResponseSerializer, SearchVacancyParamsSerializer, SearchVacancyResultSerializer, VacancyDetailSerializer, VacancySerializer, VacancyWithShiftsSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from vacancies.services.vacancy_list_service import VacancyListService
from vacancies.services.vacancy_search_service import VacancySearchService
from user_auth.permissions import IsInGroup
from rest_framework.response import Response
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from rest_framework.exceptions import NotFound
from eventos.models.event import Event
from django.db.models import Prefetch

class CreateVacancyView(CreateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def create(self, request, *args, **kwargs):

        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        response_serializer = VacancyResponseSerializer(serializer.instance, many=many)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    

class UpdateVacancyView(UpdateAPIView):
    serializer_class = VacancySerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        return Vacancy.objects.select_related('event').filter(event__owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response_serializer = VacancyResponseSerializer(instance)
        return Response(response_serializer.data)


class ListVacancyShiftView(ListAPIView):
    serializer_class = ListVacancyShiftSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]
    pagination_class = CustomPagination

    def get_queryset(self):
        category = self.request.query_params.get('category')
        user = self.request.user

        base_qs = VacancyListService.get_base_queryset()

        if category == 'interests':
            return VacancyListService.filter_by_interests(base_qs, user)
        elif category == 'soon':
            return VacancyListService.filter_by_soon(base_qs)
        elif category == 'nearby':
            result = VacancyListService.filter_by_nearby(base_qs, user)
            if isinstance(result, list):
                return result
            return result
        elif category is not None and category != '' and category not in ['interests', 'soon', 'nearby']:
            raise ValidationError("Invalid category. Must be 'interests', 'soon', or 'nearby'.")

        return base_qs


class SearchVacancyView(ListAPIView):
    serializer_class = SearchVacancyResultSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE, EMPLOYER_ROLE]
    pagination_class = CustomPagination

    def get_queryset(self):
        params_data = {
            'choice': self.request.query_params.get('choice'),
            'value': self.request.query_params.getlist('value'),
            'date_from': self.request.query_params.get('date_from'),
            'date_to': self.request.query_params.get('date_to'),
            'order_by': self.request.query_params.get('order_by')
        }
        if self.request.query_params.get('date_from'):
            params_data['date_from'] = self.request.query_params.get('date_from')
        if self.request.query_params.get('date_to'):
            params_data['date_to'] = self.request.query_params.get('date_to')
        serializer = SearchVacancyParamsSerializer(data=params_data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        choice = validated['choice']
        value = validated.get('value')
        date_from = validated.get('date_from')
        date_to = validated.get('date_to')


        qs = VacancySearchService.get_base_queryset()

        if choice == 'role':
            qs = VacancySearchService.filter_by_roles(qs, value)
        elif choice == 'event':
            qs = VacancySearchService.filter_by_events(qs, value)
        elif choice == 'date':
            qs = VacancySearchService.filter_by_date_range(qs, date_from, date_to)

        order_key = validated.get('order_by')
        qs = VacancySearchService.order_queryset(qs, order_key)

        return qs
    

class VacancyDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VacancyDetailSerializer

    def get_queryset(self):
        return Vacancy.objects.select_related(
            'event__owner__profile_image',
            'event__category',
            'event__state',
            'event__event_image',
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
            raise NotFound(detail=VACANCY_NOT_FOUND)

class EmployerEventsWithVacanciesView(ListAPIView):
    serializer_class = EmployerEventsWithVacanciesSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(owner=user).prefetch_related(
            'vacancies__state',
            'vacancies__job_type'
        )
    
class EmployerEventsWithVacanciesByIdView(RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]
    serializer_class = EmployerEventsWithVacanciesSerializer
    lookup_url_kwarg = "event_id"

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(owner=user)

    def get_object(self):
        queryset = self.get_queryset()
        event_id = self.kwargs.get(self.lookup_url_kwarg)

        try:
            event = queryset.get(id=event_id)
        except Event.DoesNotExist:
            raise NotFound(detail="Evento no encontrado.")

        return event



class ListVacancyWithShiftView(RetrieveAPIView):
    serializer_class = VacancyWithShiftsSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get_queryset(self):
        user = self.request.user
        # Seleccionamos job_type con select_related y prefetch solo los campos necesarios
        return Vacancy.objects.filter(event__owner=user).select_related(
            'job_type'
        ).prefetch_related(
            Prefetch('requirements', queryset=Requirements.objects.only('id', 'description')),
            Prefetch('shifts', queryset=Shift.objects.only('id', 'start_date', 'end_date', 'start_time', 'end_time', 'payment'))
        ).order_by('id')