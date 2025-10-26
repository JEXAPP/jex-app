from datetime import datetime, timedelta
from django.conf import settings
import jwt
import requests
from typing import Optional
from user_auth.models.user import CustomUser

class MercadoPagoService:
    @staticmethod
    def exchange_code_for_tokens(code: str) -> dict:
        data = {
            "client_secret": settings.MP_CLIENT_SECRET,
            "client_id": settings.MP_CLIENT_ID,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.MP_AUTH_REDIRECT_URI,
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

    @staticmethod
    def get_access_token() -> str:
        """
        Obtiene dinámicamente el token de acceso de Mercado Pago
        usando client_id y client_secret (OAuth Client Credentials).
        """
        resp = requests.post(
            settings.MP_TOKEN_URL,
            data={
                "grant_type": "client_credentials",
                "client_id": settings.MP_CLIENT_ID,
                "client_secret": settings.MP_CLIENT_SECRET
            }
        )
        if resp.status_code != 200:
            raise Exception(f"Error obteniendo access token MP: {resp.json()}")

        return resp.json()["access_token"]

    @staticmethod
    def create_payment_link(
        employee_account,
        amount: float,
        concept: Optional[str] = None,
        external_reference: Optional[str] = None
    ) -> str:
        """
        Crea un link de pago en Mercado Pago para marketplace, 
        incluyendo los fees de Mercado Pago (6.53%) y la comisión propia (3.47%),
        los cuales serán cubiertos por el empleador.
        """

        # Validar que tenga access_token
        if not employee_account.access_token:
            raise Exception("El empleado debe autorizar su cuenta de Mercado Pago primero")

        token = employee_account.access_token
        url = f"{settings.MP_API_URL}/checkout/preferences"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        # Porcentajes de fees
        mp_fee_percent = 0.0653
        app_fee_percent = 0.0347

        # Monto total bruto que debe pagar el empleador
        total_amount = amount / (1 - (mp_fee_percent + app_fee_percent))

        # Comisión de tu app (marketplace_fee)
        commission = total_amount * app_fee_percent

        preference_data = {
            "items": [
                {
                    "title": concept or "Pago de turno trabajado",
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": round(total_amount, 2),
                }
            ],
            "payment_methods": {"installments": 1},
            "back_urls": {
                "success": settings.MP_SUCCESS_URL,
                "failure": settings.MP_FAILURE_URL,
                "pending": settings.MP_PENDING_URL,
            },
            "auto_return": "approved",
            "marketplace_fee": round(commission, 2),
            # Quitá external_reference de metadata
            "metadata": {
                "employee_email": employee_account.user.email,
            }
        }

        if external_reference:
            preference_data["external_reference"] = external_reference

        try:
            resp = requests.post(url, headers=headers, json=preference_data)
            resp.raise_for_status()
        except Exception as e:
            raise Exception(f"Error en request a MP: {str(e)}") from e

        data = resp.json()
        if resp.status_code != 201:
            raise Exception(f"Error creando preferencia MP: {data}")

        return data.get("init_point")