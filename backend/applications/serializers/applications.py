from rest_framework import serializers
from applications.constants import ApplicationStates
from applications.models.applications_states import ApplicationState
from eventos.formatters.date_time import CustomDateField, CustomTimeField
from notifications.constants import NotificationTypes
from notifications.services.send_notification import send_notification
from user_auth.utils import get_city_locality, calculate_age
from vacancies.constants import VacancyStates
from applications.errors.application_messages import ALREADY_APPLIED_SHIFTS, EMPLOYEE_PROFILE_NOT_FOUND, NOT_PERMISSION_APPLICATION, NOT_PERMISSION_APPLICATION
from vacancies.errors.vacancies_messages import SHIFTS_IDS_MUST_BE_INTEGERES, SHIFTS_NOT_BELONG_VACANCY, VACANCY_NOT_ACTIVE, VACANCY_NOT_FOUND
from vacancies.models import Vacancy, Shift
from applications.models.applications import Application
from user_auth.models.employee import EmployeeProfile
from django.db import transaction
from rest_framework.exceptions import PermissionDenied

from vacancies.serializers.shifts import ShiftForApplicationSerializer



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
        user = self.context['user']

        # Validar que la vacante esté activa
        self.validate_vacancy_active(vacancy_id)

        # Validar que los turnos pertenezcan a la vacante
        valid_shift_ids = set(
            Shift.objects.filter(id__in=shifts, vacancy_id=vacancy_id)
            .values_list('id', flat=True)
        )
        if valid_shift_ids != set(shifts):
            raise serializers.ValidationError(SHIFTS_NOT_BELONG_VACANCY)

        # Validar que el empleado no se haya postulado ya a esos turnos
        try:
            employee = EmployeeProfile.objects.get(user=user)
        except EmployeeProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_PROFILE_NOT_FOUND)

        already_applied_shifts = set(
            Application.objects.filter(employee=employee, shift_id__in=shifts)
            .values_list('shift_id', flat=True)
        )

        if already_applied_shifts:
            raise serializers.ValidationError(
                ALREADY_APPLIED_SHIFTS.format(shifts=", ".join(map(str, already_applied_shifts)))
            )

        return data

    def save(self, **kwargs):
        user = self.context['user']
        employee = EmployeeProfile.objects.get(user=user)
        vacancy_id = self.validated_data['vacancy_id']

        shifts_ids = self.validated_data['shifts']

        vacancy = Vacancy.objects.select_related("event__owner").get(id=vacancy_id)
        employer = vacancy.event.owner
        pending_state = ApplicationState.objects.get(name=ApplicationStates.PENDING.value)

        with transaction.atomic():
            Application.objects.bulk_create([
                Application(employee=employee, shift_id=shift_id, state=pending_state)
                for shift_id in shifts_ids
            ])

        send_notification(
            user=employer,
            title="Nueva postulación",
            message="POSTULADO nomas",
            notification_type_name=NotificationTypes.APPLICATION.value
        )

        return True



class ApplicationDetailSerializer(serializers.ModelSerializer):
    current_shift = ShiftForApplicationSerializer(source='shift', read_only=True)
    shifts = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    description = serializers.CharField(source='employee.description')
    age = serializers.SerializerMethodField()
    approximate_location = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ["current_shift", "shifts", "profile_image", "name", "description", "age", "approximate_location"]

    def get_profile_image(self, obj):
        return obj.employee.user.profile_image.url if obj.employee.user.profile_image else None

    def get_name(self, obj):
        return f"{obj.employee.user.first_name} {obj.employee.user.last_name}"
    
    def get_age(self, obj):
        return calculate_age(obj.employee.birth_date)
    
    def get_approximate_location(self, obj):
        return get_city_locality(obj.employee.address)

    def get_shifts(self, obj):
        """
        Devuelve los otros shifts de la misma vacante a la que el empleado se postuló.
        Excluye el shift actual.
        """
        current_shift_id = obj.shift.id if obj.shift else None
        vacancy_shifts = getattr(obj.shift.vacancy, "_prefetched_objects_cache", {}).get("shifts", obj.shift.vacancy.shifts.all())
        other_shifts = [s for s in vacancy_shifts if s.id != current_shift_id]
        return ShiftForApplicationSerializer(other_shifts, many=True).data

    def validate(self, attrs):
        user = self.context.get("user")
        application = self.instance
        if application.shift.vacancy.event.owner != user:
            raise PermissionDenied(NOT_PERMISSION_APPLICATION)
        return attrs
    

class ApplicationByShiftSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(source="id")
    created_at = CustomDateField()
    employee_id = serializers.IntegerField(source="employee.user_id")
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
        return obj.employee.user.profile_image.url if obj.employee.user.profile_image else None


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


class ApplicationDetailForOfferSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ["employee", "shift"]

    def get_employee(self, obj):
        user = obj.employee.user
        image = user.profile_image
        return {
            "profile_image": image.url if image else None,
            "name": f"{user.first_name} {user.last_name}".strip()
        }

    def get_shift(self, obj):
        shift = obj.shift
        vacancy = shift.vacancy

        # job_type: si es 11 (Otro) usar specific_job_type
        job_type_name = (
            vacancy.specific_job_type
            if vacancy.job_type_id == 11 and vacancy.specific_job_type
            else vacancy.job_type.name
        )

        requirements = list(
            vacancy.requirements.values_list("description", flat=True)
        )

        return {
            "start_date": shift.start_date.strftime("%d/%m/%Y"),
            "start_time": shift.start_time.strftime("%H:%M"),
            "end_date": shift.end_date.strftime("%d/%m/%Y"),
            "end_time": shift.end_time.strftime("%H:%M"),
            "payment": str(shift.payment),
            "vacancy": {
                "job_type": job_type_name,
                "description": vacancy.description,
                "requirements": requirements,
            },
        }