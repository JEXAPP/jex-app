from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
import requests
from rest_framework import status, permissions, views
from rest_framework.response import Response
from payments.constants import PaymentStates
from payments.errors.mercado_pago import INVALID_SIGNATURE, NO_VALID_PAYMENT, PAYMENT_NOT_FOUND, MISSING_MP_CODE, PAYMENT_NOT_FOUND, NO_VALID_PAYMENT
from payments.models.mercado_pago import MercadoPagoAccount
from payments.models.payment_state import PaymentState
from payments.models.payments import Payment
from payments.serializers.payments import GeneratePaymentLinkSerializer, PaymentCallbackSerializer
from payments.services.mercado_pago_service import MercadoPagoService
from user_auth.constants import EMPLOYER_ROLE
from decimal import Decimal
import hmac
import hashlib
import requests
import mercadopago
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response


class MercadoPagoOAuthCallbackView(views.APIView):
    """
    Endpoint que recibe el `code` y el `state` de Mercado Pago y guarda los tokens
    asociados al usuario correspondiente.
    """
    permission_classes = []

    def get(self, request, *args, **kwargs):
        code = request.query_params.get("code")
        state = request.query_params.get("state")

        if not code or not state:
            return Response(MISSING_MP_CODE, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar el JWT temporal para obtener el usuario
        try:
            user = MercadoPagoService.decode_oauth_state(state)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        # Intercambiar el code por tokens de Mercado Pago
        try:
            token_data = MercadoPagoService.exchange_code_for_tokens(code)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        # Crear o actualizar la cuenta de Mercado Pago asociada al usuario
        account, _ = MercadoPagoAccount.objects.update_or_create(
            user=user,
            defaults={
                "mp_user_id": token_data.get("user_id"),
                "access_token": token_data.get("access_token"),
                "refresh_token": token_data.get("refresh_token"),
                "public_key": token_data.get("public_key"),
                "live_mode": token_data.get("live_mode"),
                "expires_in": token_data.get("expires_in"),
                "scope": token_data.get("scope"),
            },
        )

        redirect_url = f"jex://auth/additional-info/step-four?status=success&user_id={user.id}"
        response = HttpResponse(status=302)
        response['Location'] = redirect_url
        return response
    

class GenerateMPStateView(views.APIView):
    """
    Endpoint donde el usuario autenticado obtiene un JWT temporal para usar
    como `state` en la autorización de Mercado Pago.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id

        # Generar JWT temporal para Mercado Pago (state)
        state_token = MercadoPagoService.generate_oauth_state(user_id)

        return Response({"state": state_token}, status=status.HTTP_200_OK)
    


class GeneratePaymentLinkView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    required_groups = [EMPLOYER_ROLE]

    def post(self, request, *args, **kwargs):
        serializer = GeneratePaymentLinkSerializer(
            data={"offer_id": kwargs.get("offer_id")},
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        offer = serializer.validated_data["offer"]
        amount = Decimal(serializer.validated_data["amount"])
        concept = serializer.validated_data["concept"]
        employee_user = offer.employee.user

        # Calculamos la comisión automáticamente (10% del monto)
        commission = (amount * Decimal("0.10")).quantize(Decimal("0.01"))

        pending_state = PaymentState.objects.get(name=PaymentStates.PENDING.value)

        # Traemos la cuenta de Mercado Pago del empleado
        try:
            mp_account = employee_user.mercado_pago_account
        except MercadoPagoAccount.DoesNotExist:
            return Response(
                {"error": "El empleado no tiene cuenta de Mercado Pago"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Buscar si ya existe un Payment pendiente para la misma oferta y empleado
            payment = Payment.objects.filter(
                offer=offer,
                employee=employee_user,
                state=pending_state
            ).first()

            if payment:
                # Reutilizar el link si ya tenemos mp_payment_id
                payment_url = None
                if payment.mp_payment_id:
                    sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
                    mp_resp = sdk.payment().get(payment.mp_payment_id)
                    if mp_resp["status"] == 200:
                        mp_data = mp_resp["response"]
                        payment_url = mp_data.get(
                            "transaction_details", {}
                        ).get("external_resource_url")
                if not payment_url:
                    payment_url = MercadoPagoService.create_payment_link(
                        mp_account, amount, commission, concept, external_reference=str(payment.id)
                    )
            else:
                # Crear nuevo Payment
                payment = Payment.objects.create(
                    offer=offer,
                    employee=employee_user,
                    amount=amount,
                    commission=commission,
                    concept=concept,
                    mp_payment_id=None,
                    state=pending_state
                )
                payment_url = MercadoPagoService.create_payment_link(
                    mp_account, amount, commission, concept, external_reference=str(payment.id)
                )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "payment_url": payment_url,
            "payment_id": payment.id
        }, status=status.HTTP_200_OK)


class PaymentCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # Mercado Pago redirige con preference_id y external_reference como query params
        preference_id = request.query_params.get("preference_id")
        external_reference = request.query_params.get("external_reference")

        # Buscar el Payment por external_reference
        payment = None
        if external_reference:
            payment = Payment.objects.filter(id=external_reference).first()
        elif preference_id:
            payment = Payment.objects.filter(mp_payment_id=preference_id).first()

        if not payment:
            return Response(PAYMENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        # Mostrar el estado actual del pago desde la base de datos
        return Response({
            "payment_id": payment.id,
            "payment_state": payment.state.name,
            "payment_state_message": payment.state.get_display_name() if hasattr(payment.state, "get_display_name") else payment.state.name
        }, status=status.HTTP_200_OK)



class MercadoPagoWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PaymentCallbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extraer el payment_id desde data['id']
        mp_payment_id = request.data.get("data", {}).get("id")
        if not mp_payment_id:
            return Response(MISSING_MP_CODE, status=status.HTTP_400_BAD_REQUEST)
        # --- 1. Validar la firma ---
        signature_received = request.headers.get("X-MercadoPago-Signature")
        body_bytes = request.body
        secret = settings.MP_WEBHOOK_SECRET.encode("utf-8")

        expected_signature = hmac.new(secret, body_bytes, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature_received or "", expected_signature):
            return Response(INVALID_SIGNATURE, status=status.HTTP_403_FORBIDDEN)

        # --- 2. Obtener el pago ---
        try:
            payment = Payment.objects.get(mp_payment_id=mp_payment_id)
        except Payment.DoesNotExist:
            return Response(PAYMENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        # --- 3. Consultar estado real en Mercado Pago ---
        sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
        mp_resp = sdk.payment().get(mp_payment_id)
        if mp_resp["status"] != 200:
            return Response(NO_VALID_PAYMENT, status=status.HTTP_502_BAD_GATEWAY)

        mp_data = mp_resp["response"]
        status_name = mp_data.get("status", "pending")
        external_reference = mp_data.get("external_reference")

        # Buscar el Payment por external_reference
        try:
            payment = Payment.objects.get(id=external_reference)
        except Payment.DoesNotExist:
            return Response(PAYMENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        # Si no tiene mp_payment_id, lo actualizamos
        if not payment.mp_payment_id:
            payment.mp_payment_id = mp_payment_id

        # Mapear a PaymentStates
        if status_name == "approved":
            payment_state = PaymentStates.APPROVED.value
            friendly_status = "Aprobado"
        elif status_name == "pending" or status_name == "in_process":
            payment_state = PaymentStates.PENDING.value
            friendly_status = "Pendiente"
        else:
            payment_state = PaymentStates.FAILURE.value
            friendly_status = "Fallido"

        # --- 4. Actualizar estado en DB ---
        payment.state = PaymentState.objects.get(name=payment_state)
        payment.save()

        return Response({
            "message": "Pago actualizado vía webhook",
            "payment_status": payment_state,
            "payment_status_message": friendly_status
        }, status=status.HTTP_200_OK)