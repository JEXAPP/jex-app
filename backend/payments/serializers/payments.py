# payments/serializers.py
from rest_framework import serializers

from applications.models.offers import Offer
from applications.utils import get_job_type_display
from payments.errors.mercado_pago import EMPLOYEE_NO_MP_ACCOUNT, NO_PERMISSION_FOR_PAYMENT, OFFER_NO_SHIFT, OFFER_NOT_EXIST, SHIFT_NO_VACANCY
from payments.models.mercado_pago import MercadoPagoAccount


class GeneratePaymentLinkSerializer(serializers.Serializer):
    offer_id = serializers.IntegerField(required=True)

    def validate(self, data):
        request = self.context.get("request")
        offer_id = data.get("offer_id")

        # Validar existencia de la oferta con relaciones necesarias
        try:
            offer = Offer.objects.select_related(
                "selected_shift__vacancy__event__owner",
                "employee__user"
            ).get(id=offer_id)
        except Offer.DoesNotExist:
            raise serializers.ValidationError(OFFER_NOT_EXIST)

        if not offer.selected_shift:
            raise serializers.ValidationError(OFFER_NO_SHIFT)

        vacancy = offer.selected_shift.vacancy
        if not vacancy:
            raise serializers.ValidationError(SHIFT_NO_VACANCY)

        # Validar que el owner de la vacante sea el mismo empleador que hace la request
        if request and vacancy.event.owner != request.user:
            raise serializers.ValidationError(NO_PERMISSION_FOR_PAYMENT)

        # Validar cuenta MP del empleado
        try:
            employee_account = offer.employee.user.mercado_pago_account
        except MercadoPagoAccount.DoesNotExist:
            raise serializers.ValidationError(EMPLOYEE_NO_MP_ACCOUNT)

        # Enriquecer datos validados
        data["offer"] = offer
        data["amount"] = offer.selected_shift.payment
        data["employee_account"] = employee_account
        data["commission"] = float(offer.selected_shift.payment) * 0.1

        # Concepto de la transferencia
        vacancy_job_type = get_job_type_display(vacancy)
        employee_name = f"{offer.employee.user.first_name} {offer.employee.user.last_name}".strip()
        concept = f"{vacancy_job_type} - Pago a {employee_name}"
        data["concept"] = concept

        return data

class PaymentCallbackSerializer(serializers.Serializer):
    payment_id = serializers.CharField(required=False, allow_blank=True)
    preference_id = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if not data.get("payment_id") and not data.get("preference_id"):
            raise serializers.ValidationError("Se requiere payment_id o preference_id")
        return data
