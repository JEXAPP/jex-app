from rest_framework import serializers
from applications.constants import ApplicationStates
from applications.models.applications_states import ApplicationState
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from vacancies.constants import VacancyStates
from applications.errors.application_messages import EMPLOYEE_PROFILE_NOT_FOUND
from vacancies.errors.vacancies_messages import SHIFTS_IDS_MUST_BE_INTEGERES, SHIFTS_NOT_BELONG_VACANCY, VACANCY_NOT_ACTIVE, VACANCY_NOT_FOUND
from vacancies.models import Vacancy, Shift
from applications.models.applications import Application
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
            
            pending_state = ApplicationState.objects.get(name=ApplicationStates.PENDING.value)

            Application.objects.bulk_create([
                Application(employee=employee, shift_id=shift_id, state=pending_state)
                for shift_id in new_shift_ids
            ])

        return True


class EmployeeProfileDetailSerializer(serializers.ModelSerializer):
    is_user_active = serializers.SerializerMethodField()
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'full_name',
            'is_user_active',
            'description',
        ]

    def get_is_user_active(self, obj):
        return obj.user.is_active if obj.user else False



class ApplicationDetailSerializer(serializers.ModelSerializer):
    employee = EmployeeProfileDetailSerializer()
    payment = serializers.DecimalField(source="shift.payment", max_digits=10, decimal_places=2, read_only=True)
    start_date = serializers.DateField(source="shift.start_date", format="%d/%m/%Y", read_only=True)
    start_time = serializers.TimeField(source="shift.start_time", format="%H", read_only=True)
    end_date = serializers.DateField(source="shift.end_date", format="%d/%m/%Y", read_only=True)
    end_time = serializers.TimeField(source="shift.end_time", format="%H", read_only=True)

    class Meta:
        model = Application
        fields = [
            'employee',
            'payment',
            'start_date', 'start_time',
            'end_date', 'end_time',
        ]
class ApplicationByShiftSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(source="id")
    created_at = CustomDateField()
    employee_id = serializers.IntegerField(source="employee.id")
    full_name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "application_id",
            "created_at",
            "employee_id",
            "full_name",
            "profile_image",
        ]

    def get_full_name(self, obj):
        user = obj.employee.user
        return f"{user.first_name} {user.last_name}".strip()
    
    def get_profile_image(self, obj):
        user = obj.employee.user
        if user.profile_image:
            return user.profile_image 
        return None


class ShiftWithApplicationsSerializer(serializers.ModelSerializer):
    shift_id = serializers.IntegerField(source="id")
    quantity = serializers.IntegerField()
    start_time = CustomTimeField()
    end_time = CustomTimeField()
    start_date = CustomDateField()
    end_date = CustomDateField()
    applications = ApplicationByShiftSerializer(many=True, read_only=True)

    quantity_offers = serializers.IntegerField(read_only=True)

    class Meta:
        model = Shift
        fields = [
            "shift_id",
            "start_time",
            "end_time",
            "start_date",
            "end_date",
            "quantity",
            "applications",
            "quantity_offers",
        ]


