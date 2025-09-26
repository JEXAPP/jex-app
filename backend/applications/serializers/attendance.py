from django.shortcuts import get_object_or_404
from rest_framework import serializers
from applications.constants import OfferStates
from applications.errors.attendance_messages import (
    EMPLOYEE_DOES_NOT_MATCH_TOKEN,
    NOT_ACCEPTED_OFFER,
    NOT_EVENT_OWNER,
    ALREADY_REGISTERED_ATTENDANCE,
    TOKEN_MISSING_REQUIRED_FIELDS,
)
from applications.models.attendance import Attendance
from applications.models.offer_state import OfferState
from applications.models.offers import Offer
from applications.utils import decode_qr_token, get_job_type_display
from notifications.errors.device_messages import INVALID_TOKEN


class AttendanceValidationSerializer(serializers.Serializer):
    qr_token = serializers.CharField()

    def validate_qr_token(self, value):
        """
        Decodifica el token QR y obtiene offer_id y employee_id
        """
        try:
            payload = decode_qr_token(value)
        except Exception as e:
            raise serializers.ValidationError(INVALID_TOKEN)

        self._offer_id = payload.get("offer_id")
        self._employee_id = payload.get("employee_id")

        if not self._offer_id or not self._employee_id:
            raise serializers.ValidationError(TOKEN_MISSING_REQUIRED_FIELDS)

        return value

    def validate(self, attrs):
        request_user = self.context['request'].user

        # Obtenemos la oferta en estado aceptado
        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        offer = get_object_or_404(
            Offer.objects.select_related("selected_shift__vacancy__event", "employee"),
            pk=self._offer_id,
            state=state_accepted
        )

        shift = offer.selected_shift
        employee = offer.employee

        # Validamos que el employee del token coincida con la oferta
        if employee.id != self._employee_id:
            raise serializers.ValidationError(EMPLOYEE_DOES_NOT_MATCH_TOKEN)

        # Validamos que no exista asistencia ya registrada
        if Attendance.objects.filter(employee=employee, shift=shift).exists():
            raise serializers.ValidationError(ALREADY_REGISTERED_ATTENDANCE)

        # Validamos que el request.user sea dueño del evento
        if shift.vacancy.event.owner != request_user:
            raise serializers.ValidationError(NOT_EVENT_OWNER)

        # Guardamos en validated_data para crear la asistencia
        attrs["shift"] = shift
        attrs["employee"] = employee
        return attrs


class AttendanceResponseSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source="employee.user.email")
    shift = serializers.IntegerField(source="shift.id")
    verified_by = serializers.CharField(source="verified_by.user.email", allow_null=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee", "shift", "check_in", "verified_by"]



class GenerateQRTokenSerializer(serializers.Serializer):
    offer_id = serializers.IntegerField()

    def validate_offer_id(self, value):
        user = self.context['request'].user

        # Verificamos que la oferta exista y esté aceptada
        state_accepted = get_object_or_404(OfferState, name=OfferStates.ACCEPTED.value)
        offer = get_object_or_404(Offer, pk=value, state=state_accepted)

        # Verificamos que el empleado sea dueño de la oferta
        if offer.employee.user != user:
            raise serializers.ValidationError(NOT_ACCEPTED_OFFER)

        # Verificamos que no haya asistencia ya registrada
        if Attendance.objects.filter(employee=offer.employee, shift=offer.selected_shift).exists():
            raise serializers.ValidationError(ALREADY_REGISTERED_ATTENDANCE)

        return value

    def get_offer(self):
        """
        Devuelve el objeto Offer validado
        """
        offer_id = self.validated_data['offer_id']
        return Offer.objects.get(pk=offer_id)
    


class OfferByEventSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField(source="employee.user.id", read_only=True)
    employee_name = serializers.CharField(source="employee.user.get_full_name", read_only=True)
    job_type = serializers.SerializerMethodField()
    has_attendance = serializers.SerializerMethodField()
    shift_id = serializers.IntegerField(source="selected_shift.id", read_only=True)

    class Meta:
        model = Offer
        fields = [
            "id",
            "employee_id",
            "employee_name",
            "job_type",
            "has_attendance",
            "shift_id",
        ]


    def get_job_type(self, obj):
         return get_job_type_display(obj.selected_shift.vacancy)


    def get_has_attendance(self, obj):
        # Buscar asistencia por shift y employee
        return Attendance.objects.filter(
            shift=obj.selected_shift,
            employee=obj.employee
        ).exists()