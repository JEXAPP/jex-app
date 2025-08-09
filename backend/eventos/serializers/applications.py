from rest_framework import serializers
from eventos.constants import ApplicationStates, VacancyStates
from eventos.errors.application_messages import EMPLOYEE_PROFILE_NOT_FOUND, SHIFTS_IDS_MUST_BE_INTEGERES, SHIFTS_NOT_BELONG_VACANCY, VACANCY_NOT_ACTIVE, VACANCY_NOT_FOUND
from eventos.models import Vacancy, Shift
from eventos.models.applications import Application
from user_auth.models.employee import EmployeeProfile
from django.db import transaction


class ApplicationCreateSerializer(serializers.Serializer):
    vacancy_id = serializers.IntegerField()
    shifts = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
    )

    def validate_vacancy_id(self, value):
        if not Vacancy.objects.filter(id=value).exists():
            raise serializers.ValidationError(VACANCY_NOT_FOUND)
        return value

    def validate_shifts(self, value):
        if not all(isinstance(i, int) for i in value):
            raise serializers.ValidationError(SHIFTS_IDS_MUST_BE_INTEGERES)
        return value

    def validate_vacancy_active(self, vacancy_id):
        vacancy = Vacancy.objects.get(id=vacancy_id)
        if vacancy.state.name != VacancyStates.ACTIVE.value:
            raise serializers.ValidationError(VACANCY_NOT_ACTIVE)

    def validate(self, data):
        vacancy_id = data['vacancy_id']
        shifts = data['shifts']

        # Validar que la vacante esté activa
        self.validate_vacancy_active(vacancy_id)

        valid_shift_ids = set(
            Shift.objects.filter(id__in=shifts, vacancy_id=vacancy_id)
            .values_list('id', flat=True)
        )
        if valid_shift_ids != set(shifts):
            raise serializers.ValidationError(SHIFTS_NOT_BELONG_VACANCY)
        return data

    def save(self, **kwargs):
        user = self.context['user']
        try:
            employee = EmployeeProfile.objects.get(user=user)
        except EmployeeProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_PROFILE_NOT_FOUND)

        shifts_ids = self.validated_data['shifts']

        with transaction.atomic():
            existing_shift_ids = set(
                Application.objects.filter(employee=employee, shift_id__in=shifts_ids)
                .values_list('shift_id', flat=True)
            )
            new_shift_ids = set(shifts_ids) - existing_shift_ids

            if not new_shift_ids:
                return False  # No se crean nuevas postulaciones

            Application.objects.bulk_create([
                Application(employee=employee, shift_id=shift_id, status=ApplicationStates.PENDING.value)
                for shift_id in new_shift_ids
            ])

        return True

