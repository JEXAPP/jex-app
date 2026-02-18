from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
import requests
from rest_framework import status, permissions, views
from rest_framework.response import Response
from payments.constants import APP_FEE_PERCENT, MP_FEE_PERCENT, PaymentStates
from payments.errors.mercado_pago import INVALID_SIGNATURE, NO_VALID_PAYMENT, PAYMENT_NOT_FOUND, MISSING_MP_CODE, PAYMENT_NOT_FOUND, NO_VALID_PAYMENT
from payments.models.mercado_pago import MercadoPagoAccount
from payments.models.payment_state import PaymentState
from payments.models.payments import Payment
from payments.serializers.payments import GeneratePaymentLinkSerializer, PaymentCallbackSerializer
from payments.services.mercado_pago_service import MercadoPagoService
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from decimal import Decimal
import hmac
import hashlib
import requests
import mercadopago
from django.conf import settings
from rest_framework import status, views
from rest_framework.response import Response
import logging

from user_auth.permissions import IsInGroup
from urllib.parse import urlencode

logger = logging.getLogger(__name__)

class MercadoPagoOAuthCallbackView(views.APIView):
    """
    Endpoint que recibe el `code` y el `state` de Mercado Pago y guarda los tokens
    asociados al usuario correspondiente. Redirige a la app con el estado del flujo.
    """
    permission_classes = []

    def get(self, request, *args, **kwargs):

        code = request.query_params.get("code")
        state = request.query_params.get("state")
        base_redirect = "jex://employee/profile"

        # helper para construir redirect con query string
        def redirect_with(params):
            qs = urlencode(params)
            response = HttpResponse(status=302)
            response["Location"] = f"{base_redirect}?{qs}"
            return response

        if not code or not state:
            return redirect_with({"status": "error", "reason": "missing_code_or_state"})

        # Decodificar el JWT temporal para obtener el usuario
        try:
            user = MercadoPagoService.decode_oauth_state(state)
        except Exception as e:
            return redirect_with({
                "status": "error",
                "reason": "invalid_state",
                "detail": str(e)
            })

        # Intercambiar el code por tokens de Mercado Pago
        try:
            token_data = MercadoPagoService.exchange_code_for_tokens(code)
        except Exception as e:
            return redirect_with({
                "status": "error",
                "reason": "token_exchange_failed",
                "detail": str(e)
            })

        # Crear o actualizar la cuenta de Mercado Pago asociada al usuario
        try:
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
        except Exception as e:
            return redirect_with({
                "status": "error",
                "reason": "db_error",
                "detail": str(e)
            })

        # Éxito: devolver status=success (incluye user_id si se desea)
        return redirect_with({"status": "success", "user_id": user.id})
    

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
        commission = (amount * Decimal("0.05")).quantize(Decimal("0.01"))

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
                        employee_account=mp_account,
                        amount=amount,
                        concept=concept,
                        external_reference=str(payment.id)
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
                    employee_account=mp_account,
                    amount=amount,
                    concept=concept,
                    external_reference=str(payment.id)
                )

            logger.info(f"Link de pago generado: {payment_url} para payment_id: {payment.id}")

        except Exception as e:
            logger.error(f"Error creando preferencia Mercado Pago: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "payment_url": payment_url,
            "payment_id": payment.id
        }, status=status.HTTP_200_OK)


class PaymentCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # Obtener parámetros relevantes
        preference_id = request.query_params.get("preference_id")
        external_reference = request.query_params.get("external_reference")

        # Buscar el Payment
        payment = None
        if external_reference:
            payment = Payment.objects.filter(id=external_reference).first()
        elif preference_id:
            payment = Payment.objects.filter(mp_payment_id=preference_id).first()

        if not payment:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Determinar tu propio estado
        state = payment.state.name.lower()
        if state == PaymentStates.APPROVED.value.lower():
            payment_status = "success"
        elif state == PaymentStates.PENDING.value.lower():
            payment_status = "pending"
        else:
            payment_status = "failure"

        # Construir el deeplink con nombre único de parámetro
        redirect_url = f"jex://employer/offers?payment_status={payment_status}"

        # Redireccionar
        response = HttpResponse(status=302)
        response["Location"] = redirect_url
        return response

class MercadoPagoWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info("=== MP Webhook received ===")
        logger.info("Request headers: %s", request.headers)
        logger.info("Request body: %s", request.body.decode('utf-8'))

        # --- 1. Validar firma según template oficial ---
        signature_header = request.headers.get("X-Signature", "")
        signature_received = None
        ts = None

        if signature_header:
            try:
                parts = signature_header.split(",")
                ts = parts[0].split("=")[1]
                signature_received = parts[1].split("=")[1]
            except IndexError:
                logger.warning("Formato de X-Signature inválido: %s", signature_header)

        if not signature_received or not ts:
            logger.warning("X-Signature o ts faltante")
            return Response({"error": "Invalid signature"}, status=status.HTTP_403_FORBIDDEN)

        # Construir payload según template oficial: id:[data.id_url];request-id:[x-request-id];ts:[ts];
        data_id = request.data.get("data", {}).get("id", "")
        request_id = request.headers.get("X-Request-Id", "")
        payload = f"id:{data_id};request-id:{request_id};ts:{ts};".encode("utf-8")

        secret = settings.MP_WEBHOOK_SECRET.encode("utf-8")
        expected_signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()

        logger.info("Received signature (v1): %s", signature_received)
        logger.info("Expected signature: %s", expected_signature)

        if not hmac.compare_digest(signature_received, expected_signature):
            logger.warning("Invalid signature for MP webhook")
            return Response({"error": "Invalid signature"}, status=status.HTTP_403_FORBIDDEN)

        # --- 2. Validar serializer ---
        serializer = PaymentCallbackSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning("Serializer validation failed: %s", serializer.errors)
            return Response({"error": "Invalid payload", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        logger.info("Serializer validated successfully")

        # --- 3. Obtener MP payment ID ---
        mp_payment_id = request.data.get("data", {}).get("id")
        logger.info("MP payment ID from payload: %s", mp_payment_id)
        if not mp_payment_id:
            logger.warning("MP payment ID missing in payload")
            return Response({"error": "MP payment id missing"}, status=status.HTTP_400_BAD_REQUEST)

        # --- 4. Consultar pago en Mercado Pago ---
        sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
        mp_resp = sdk.payment().get(mp_payment_id)
        logger.info("MP API response: %s", mp_resp)
        if mp_resp["status"] != 200:
            logger.error("Failed to fetch payment from MP API")
            return Response({"error": "No valid payment from MP"}, status=status.HTTP_502_BAD_GATEWAY)

        mp_data = mp_resp.get("response", {})
        logger.info("MP payment data: %s", mp_data)

        # --- 5. Buscar Payment en DB ---
        try:
            payment = Payment.objects.get(mp_payment_id=mp_payment_id)
            logger.info("Payment found in DB by mp_payment_id: %s", payment.id)
        except Payment.DoesNotExist:
            logger.warning("Payment not found by mp_payment_id, trying external_reference")
            external_reference = mp_data.get("external_reference")
            logger.info("External reference from MP: %s", external_reference)
            if external_reference:
                try:
                    payment = Payment.objects.get(id=int(external_reference))
                    logger.info("Payment found in DB by external_reference: %s", payment.id)
                except (Payment.DoesNotExist, ValueError) as e:
                    logger.error("Payment not found by external_reference: %s", e)
                    return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                logger.error("Payment not found and no external_reference provided")
                return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        # --- 6. Mapear estado ---
        status_name = mp_data.get("status", "pending")
        logger.info("MP payment status: %s", status_name)
        if status_name == "approved":
            payment_state = PaymentStates.APPROVED.value
            friendly_status = "Aprobado"
        elif status_name in ["pending", "in_process"]:
            payment_state = PaymentStates.PENDING.value
            friendly_status = "Pendiente"
        else:
            payment_state = PaymentStates.FAILURE.value
            friendly_status = "Fallido"

        # --- 7. Actualizar Payment ---
        payment.state = PaymentState.objects.get(name=payment_state)
        if not payment.mp_payment_id:
            payment.mp_payment_id = mp_payment_id
        payment.save()
        logger.info("Payment updated successfully: %s - %s", payment.id, payment_state)

        return Response({
            "message": "Pago actualizado vía webhook",
            "payment_status": payment_state,
            "payment_status_message": friendly_status,
            "comprobante": mp_payment_id
        }, status=status.HTTP_200_OK)
    

class MercadoPagoAccountAssociatedView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYEE_ROLE]

    def get(self, request, *args, **kwargs):
        user = request.user
        has_account = hasattr(user, "mercado_pago_account")
        return Response({"has_account": has_account}, status=status.HTTP_200_OK)
    

class MercadoPagoFeeDetailsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    required_groups = [EMPLOYER_ROLE]

    def get(self, request, *args, **kwargs):
        mp_fee_percent = MP_FEE_PERCENT
        app_fee_percent = APP_FEE_PERCENT
        total_fee_percent = mp_fee_percent + app_fee_percent
        return Response({
            "total_fee_percent": round(total_fee_percent * 100, 2),
            "mp_fee_percent": round(mp_fee_percent * 100, 2),
            "app_fee_percent": round(app_fee_percent * 100, 2)
        }, status=status.HTTP_200_OK)
        