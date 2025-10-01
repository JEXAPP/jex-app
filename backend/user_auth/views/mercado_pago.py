from rest_framework import status, permissions, views
from rest_framework.response import Response
from user_auth.models.user import MercadoPagoAccount
from user_auth.serializers.mercado_pago import MercadoPagoAccountSerializer
from user_auth.services.mercado_pago import MercadoPagoService
from user_auth.errors.mercado_pago import MISSING_MP_CODE


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

        return Response(MercadoPagoAccountSerializer(account).data, status=status.HTTP_200_OK)
    

class GenerateMPStateView(views.APIView):
    """
    Endpoint donde el usuario autenticado obtiene un JWT temporal para usar
    como `state` en la autorización de Mercado Pago.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.user.id

        # Generar JWT temporal para Mercado Pago (state)
        state_token = MercadoPagoService.generate_oauth_state(user_id)

        return Response({"state": state_token}, status=status.HTTP_200_OK)
