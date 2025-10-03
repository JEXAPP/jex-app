from django.conf import settings
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

        redirect_url = f"jex://mercadopago/success?status=success&user_id={user.id}"
        return redirect(redirect_url)
    

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
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        employee_account = serializer.validated_data["employee_account"]
        amount = Decimal(serializer.validated_data["amount"])
        concept = serializer.validated_data["concept"]
        offer = serializer.validated_data["offer"]

        # Calculamos la comisión automáticamente (10% del monto)
        commission = (amount * Decimal("0.10")).quantize(Decimal("0.01"))

        pending_state = PaymentState.objects.get(name=PaymentStates.PENDING.value)

        try:
            # Crear el link de pago
            payment_url = MercadoPagoService.create_payment_link(
                employee_account, amount, commission, concept
            )

            # Crear el objeto Payment en DB
            payment = Payment.objects.create(
                offer=offer,
                employee=offer.employee.user,
                amount=amount,
                commission=commission,
                concept=concept,
                mp_payment_id=None,
                state=pending_state
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
        serializer = PaymentCallbackSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        mp_payment_id = serializer.validated_data.get("payment_id") or serializer.validated_data.get("preference_id")

        # Intentamos obtener el pago, pero no necesariamente lo marcamos como completado
        payment = Payment.objects.filter(mp_payment_id=mp_payment_id).first()

        if not payment:
            # Podés mostrar mensaje de error en frontend
            return Response(PAYMENT_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        # Opcional: consultar estado para mostrar al usuario
        try:
            mp_resp = requests.get(
                f"{settings.MP_API_URL}/v1/payments/{mp_payment_id}",
                headers={"Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}"}
            )
            mp_data = mp_resp.json() if mp_resp.status_code == 200 else {}
            status_name = mp_data.get("status", "PENDING")
        except:
            status_name = "PENDING"

        return Response({"payment_status": status_name}, status=status.HTTP_200_OK)


class MercadoPagoWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PaymentCallbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mp_payment_id = serializer.validated_data.get("payment_id") or serializer.validated_data.get("preference_id")
        if not mp_payment_id:
            return Response(MISSING_MP_CODE, status=status.HTTP_400_BAD_REQUEST)

        # --- 1. Validar la firma ---
        signature_received = request.headers.get("X-MercadoPago-Signature")  # depende de cómo lo envíe MP
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
        mp_resp = requests.get(
            f"{settings.MP_API_URL}/v1/payments/{mp_payment_id}",
            headers={"Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}"}
        )
        if mp_resp.status_code != 200:
            return Response(NO_VALID_PAYMENT, status=status.HTTP_502_BAD_GATEWAY)

        mp_data = mp_resp.json()
        status_name = mp_data.get("status", "PENDING")

        # --- 4. Actualizar estado en DB ---
        payment.state = PaymentState.objects.get(name=status_name)
        payment.save()

        return Response({"message": f"Pago {payment.state.name} actualizado vía webhook"}, status=status.HTTP_200_OK)