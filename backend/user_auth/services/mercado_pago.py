from datetime import datetime, timedelta
from django.conf import settings
import jwt
import requests

from user_auth.models.user import CustomUser

class MercadoPagoService:
    @staticmethod
    def exchange_code_for_tokens(code: str) -> dict:
        data = {
            "client_secret": settings.MP_CLIENT_SECRET,
            "client_id": settings.MP_CLIENT_ID,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.MP_REDIRECT_URI,
        }

        resp = requests.post(settings.MP_TOKEN_URL, data=data)

        if resp.status_code != 200:
            raise Exception(f"Mercado Pago token request failed: {resp.json()}")

        return resp.json()
    

    @staticmethod
    def generate_oauth_state(user_id: int, expires_minutes: int = 5) -> str:
        """
        Genera un JWT temporal que se usará como `state` en el flujo OAuth de Mercado Pago.
        """
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + timedelta(minutes=expires_minutes),
            "type": "mp_oauth"
        }
        token = jwt.encode(payload, settings.JWT_MP_SECRET, algorithm="HS256")
        return token

    @staticmethod
    def decode_oauth_state(state_token: str) -> CustomUser:
        """
        Decodifica el JWT temporal recibido como `state` y devuelve el usuario correspondiente.
        Lanza excepción si el token es inválido o expirado.
        """
        try:
            payload = jwt.decode(state_token, settings.JWT_MP_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            return CustomUser.objects.get(id=user_id)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, CustomUser.DoesNotExist) as e:
            raise Exception("Invalid or expired state token") from e
