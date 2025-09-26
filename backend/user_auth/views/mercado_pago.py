from rest_framework import status, permissions, views
from rest_framework.response import Response
from user_auth.errors.mercado_pago import MISSING_CODE_ERROR
from user_auth.models.user import MercadoPagoAccount
from user_auth.serializers.mercado_pago import MercadoPagoAccountSerializer
from user_auth.services.mercado_pago import MercadoPagoService


class MercadoPagoOAuthCallbackView(views.APIView):
    """
    Endpoint que recibe el `code` de Mercado Pago y guarda los tokens.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        code = request.query_params.get("code")
        if not code:
            return Response(MISSING_CODE_ERROR, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_data = MercadoPagoService.exchange_code_for_tokens(code)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        account, _ = MercadoPagoAccount.objects.update_or_create(
            user=request.user,
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
