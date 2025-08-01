from rest_framework import serializers
from eventos.models import Vacancy, Shift
from eventos.models.applications import Application
from user_auth.models.employee import EmployeeProfile
from django.db import transaction


class ApplicationCreateSerializer(serializers.Serializer):
    vacancy_id = serializers.IntegerField()
    shifts = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)

    def validate_vacancy_id(self, value):
        if not Vacancy.objects.filter(id=value).exists():
            raise serializers.ValidationError("Vacancy does not exist.")
        return value

    def validate_shifts(self, value):
        if not all(isinstance(i, int) for i in value):
            raise serializers.ValidationError("All shift IDs must be integers.")
        return value

    def validate(self, data):
        vacancy_id = data['vacancy_id']
        shifts = data['shifts']
        valid_shift_ids = set(
            Shift.objects.filter(id__in=shifts, vacancy_id=vacancy_id)
            .values_list('id', flat=True)
        )
        if valid_shift_ids != set(shifts):
            raise serializers.ValidationError("One or more shifts do not belong to the vacancy.")
        return data

    def save(self, **kwargs):
        user = self.context['user']
        try:
            employee = EmployeeProfile.objects.get(user=user)
        except EmployeeProfile.DoesNotExist:
            raise serializers.ValidationError("Employee profile not found for the authenticated user.")

        shifts_ids = self.validated_data['shifts']

        with transaction.atomic():
            existing_shift_ids = set(
                Application.objects.filter(employee=employee, shift_id__in=shifts_ids)
                .values_list('shift_id', flat=True)
            )
            new_shift_ids = set(shifts_ids) - existing_shift_ids

            if not new_shift_ids:
                return  # ya postulado a todos, no hacemos nada

            Application.objects.bulk_create([
                Application(employee=employee, shift_id=shift_id, status='PENDING')
                for shift_id in new_shift_ids
            ])


