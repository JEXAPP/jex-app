from datetime import datetime
import json
from django.forms import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from config.pagination import CustomPagination
from eventos.errors.application_messages import VACANCY_NOT_FOUND
from eventos.models.vacancy import Vacancy
from eventos.serializers.vacancy import ListVacancyShiftSerializer, VacancyResponseSerializer, SearchVacancyParamsSerializer, SearchVacancyResultSerializer, VacancyDetailSerializer, VacancySerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from eventos.services.vacancy_list_service import VacancyShiftService
from eventos.services.vacancy_search_service import VacancySearchService
from user_auth.permissions import IsInGroup
from rest_framework.response import Response
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from rest_framework.exceptions import NotFound
from eventos.constants import ORDERING_MAP, Unaccent, VacancyStates


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

        base_qs = VacancyShiftService.get_base_queryset()

        if category == 'interests':
            return VacancyShiftService.filter_by_interests(base_qs, user)
        elif category == 'soon':
            return VacancyShiftService.filter_by_soon()
        elif category == 'nearby':
            result = VacancyShiftService.filter_by_nearby(base_qs, user)
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
            'value': self.request.query_params.get('value')
        }
        serializer = SearchVacancyParamsSerializer(data=params_data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        choice = validated['choice']
        value = validated['value']

        qs = VacancySearchService.get_base_queryset()

        if choice == 'role':
            qs = VacancySearchService.filter_by_role(qs, value)
        elif choice == 'event':
            qs = VacancySearchService.filter_by_event(qs, value)
        elif choice == 'start_date':
            qs = VacancySearchService.filter_by_start_date(qs, value)

        order_key = self.request.query_params.get('order_by')
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