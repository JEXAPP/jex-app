from django.shortcuts import get_object_or_404
from rest_framework import serializers

from applications.errors.attendance_messages import (
    EMPLOYEE_NOT_FOUND,
    NOT_ACCEPTED_OFFER,
    SHIFT_NOT_FOUND,
    ALREADY_REGISTERED_ATTENDANCE
)
from applications.models.attendance import Attendance
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from user_auth.models.employee import EmployeeProfile
from vacancies.models.shifts import Shift
from applications.constants import OfferStates


class AttendanceValidationSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField()
    employee_id = serializers.IntegerField()

    def validate(self, attrs):
        shift_id = attrs.get("shift_id")
        employee_id = attrs.get("employee_id")

        # Validar que existan Shift y Employee
        try:
            attrs["shift"] = Shift.objects.get(pk=shift_id)
        except Shift.DoesNotExist:
            raise serializers.ValidationError(SHIFT_NOT_FOUND)

        try:
            attrs["employee"] = EmployeeProfile.objects.get(pk=employee_id)
        except EmployeeProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_NOT_FOUND)

        # Validar que el empleado tenga una oferta aceptada para ese turno
        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        has_offer = Offer.objects.filter(
            selected_shift_id=shift_id,
            employee_id=employee_id,
            state=state_accepted
        ).exists()

        if not has_offer:
            raise serializers.ValidationError(NOT_ACCEPTED_OFFER)

        # Validar que no exista asistencia previamente registrada
        if Attendance.objects.filter(employee_id=employee_id, shift_id=shift_id).exists():
            raise serializers.ValidationError(ALREADY_REGISTERED_ATTENDANCE)

        return attrs


class AttendanceResponseSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source="employee.user.email")
    shift = serializers.IntegerField(source="shift.id")
    verified_by = serializers.CharField(source="verified_by.user.email", allow_null=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee", "shift", "check_in", "verified_by"]
