from django.shortcuts import get_object_or_404
from rest_framework import serializers
from applications.errors.attendance_messages import (
    EMPLOYEE_NOT_FOUND,
    NO_ACCEPTED_OFFER,
    NOT_ACCEPTED_OFFER,
    NOT_EVENT_OWNER,
    SHIFT_NOT_FOUND,
    ALREADY_REGISTERED_ATTENDANCE,
    SHIFT_NOT_QR_ENABLED
)
from applications.models.attendance import Attendance
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from user_auth.models.employee import EmployeeProfile
from vacancies.models.shifts import Shift
from applications.constants import DISABLE_ACTION, ENABLE_ACTION, OfferStates


class AttendanceValidationSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField()
    employee_id = serializers.IntegerField()

    def validate(self, attrs):
        shift_id = attrs.get("shift_id")
        employee_id = attrs.get("employee_id")
        request_user = self.context['request'].user

        attrs["shift"] = self._validate_shift(shift_id)
        attrs["employee"] = self._validate_employee(employee_id)
        self._validate_offer(shift_id, employee_id)
        self._validate_attendance_exists(shift_id, employee_id)
        self._validate_event_owner(attrs["shift"], request_user)

        return attrs

    def _validate_shift(self, shift_id):
        try:
            return Shift.objects.get(pk=shift_id)
        except Shift.DoesNotExist:
            raise serializers.ValidationError(SHIFT_NOT_FOUND)

    def _validate_employee(self, employee_id):
        try:
            return EmployeeProfile.objects.get(pk=employee_id)
        except EmployeeProfile.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_NOT_FOUND)

    def _validate_offer(self, shift_id, employee_id):
        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        has_offer = Offer.objects.filter(
            selected_shift_id=shift_id,
            employee_id=employee_id,
            state=state_accepted
        ).exists()
        if not has_offer:
            raise serializers.ValidationError(NOT_ACCEPTED_OFFER)

    def _validate_attendance_exists(self, shift_id, employee_id):
        if Attendance.objects.filter(employee_id=employee_id, shift_id=shift_id).exists():
            raise serializers.ValidationError(ALREADY_REGISTERED_ATTENDANCE)

    def _validate_event_owner(self, shift, user):
        if shift.vacancy.event.owner != user:
            raise serializers.ValidationError(NOT_EVENT_OWNER)


class AttendanceResponseSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source="employee.user.email")
    shift = serializers.IntegerField(source="shift.id")
    verified_by = serializers.CharField(source="verified_by.user.email", allow_null=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee", "shift", "check_in", "verified_by"]


class QRPermissionToggleSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=[ENABLE_ACTION, DISABLE_ACTION])

    def validate_shift_id(self, value):
        shift = get_object_or_404(Shift, pk=value)
        request_user = self.context['request'].user

        # Validar que el usuario es dueño del evento
        if shift.vacancy.event.owner != request_user:
            raise serializers.ValidationError(NOT_EVENT_OWNER)

        return value

    def save(self):
        shift_id = self.validated_data["shift_id"]
        action = self.validated_data["action"]
        shift = Shift.objects.get(pk=shift_id)

        if action == ENABLE_ACTION:
            shift.qr_enabled = True
        elif action == DISABLE_ACTION:
            shift.qr_enabled = False

        shift.save()
        return shift
    


class QRShiftValidationSerializer(serializers.Serializer):
    shift_id = serializers.IntegerField()

    def validate(self, data):
        request = self.context["request"]
        user = request.user

        # Obtener empleado
        employee = get_object_or_404(EmployeeProfile, user=user)
        shift = get_object_or_404(Shift, pk=data["shift_id"])

        # Validar que el shift tiene QR habilitado
        if not shift.qr_enabled:
            raise serializers.ValidationError(SHIFT_NOT_QR_ENABLED)

        # Validar que el empleado tenga una oferta aceptada para este shift
        accepted_state = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        accepted_offer = Offer.objects.filter(
            employee=employee,
            selected_shift=shift,
            state=accepted_state
        ).first()

        if not accepted_offer:
            raise serializers.ValidationError(NO_ACCEPTED_OFFER)

        data["employee"] = employee
        data["shift"] = shift
        return data