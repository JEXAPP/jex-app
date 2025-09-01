from django.shortcuts import get_object_or_404
from rest_framework import serializers
from applications.errors.attendance_messages import (
    EMPLOYEE_NOT_FOUND,
    NOT_ACCEPTED_OFFER,
    NOT_EVENT_OWNER,
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
