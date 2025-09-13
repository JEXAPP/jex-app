from rest_framework import serializers
from applications.errors.attendance_messages import (
    NOT_EVENT_OWNER,
    ALREADY_REGISTERED_ATTENDANCE,
)
from applications.models.attendance import Attendance


class AttendanceValidationSerializer(serializers.Serializer):
    def validate(self, attrs):
        request_user = self.context['request'].user
        offer = self.context['offer']

        shift = offer.selected_shift
        employee = offer.employee

        self._validate_attendance_exists(shift.id, employee.id)
        self._validate_event_owner(shift, request_user)

        attrs["shift"] = shift
        attrs["employee"] = employee
        return attrs

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

