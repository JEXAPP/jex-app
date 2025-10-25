from datetime import datetime, timedelta
from django.conf import settings
import jwt
import requests
from typing import Optional
from user_auth.models.user import CustomUser
import logging

logger = logging.getLogger(__name__)

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
        commission: float,
        concept: Optional[str] = None,
        external_reference: Optional[str] = None
    ) -> str:
        """
        Crea un link de pago en Mercado Pago con split payments (marketplace).
        El empleador paga el total, la comisión se queda en la app y el resto va al empleado.
        """
        logger.info("=== Creando preferencia Mercado Pago ===")
        logger.info(f"Empleado: {employee_account.user.email}")
        logger.info(f"Amount: {amount}, Commission: {commission}")
        logger.info(f"Concepto: {concept}")
        logger.info(f"External reference: {external_reference}")

        # Validar mp_user_id del empleado
        try:
            receiver_id = int(employee_account.mp_user_id)
            logger.info(f"Receiver ID empleado (convertido a int): {receiver_id}")
        except (ValueError, TypeError) as e:
            logger.error(f"mp_user_id inválido: {employee_account.mp_user_id}")
            raise Exception(f"mp_user_id inválido: {employee_account.mp_user_id}") from e

        # Token de la aplicación (con permisos de marketplace)
        token = settings.MP_ACCESS_TOKEN
        logger.info(f"Usando token de la app (longitud): {len(token)}")

        url = f"{settings.MP_API_URL}/checkout/preferences"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        preference_data = {
            "items": [
                {
                    "title": concept or "Pago de turno trabajado",
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": float(amount),  # Solo el monto que recibe el empleado
                    "receiver_id": receiver_id,    # El empleado recibe su parte
                }
            ],
            "payment_methods": {"installments": 1},
            "back_urls": {
                "success": settings.MP_SUCCESS_URL,
                "failure": settings.MP_FAILURE_URL,
                "pending": settings.MP_PENDING_URL,
            },
            "auto_return": "approved",
            "collector_id": int(settings.MP_COLLECTION_ID),  # Tu cuenta app
            "application_fee": float(commission),      # Comisión que te queda a ti
        }

        if external_reference:
            preference_data["external_reference"] = external_reference

        logger.info(f"Preference data que se enviará a MP: {preference_data}")

        try:
            resp = requests.post(url, headers=headers, json=preference_data)
            logger.info(f"Status code de respuesta MP: {resp.status_code}")
            logger.info(f"Respuesta MP: {resp.json()}")
        except Exception as e:
            logger.error(f"Error en request a MP: {str(e)}")
            raise Exception(f"Error en request a MP: {str(e)}") from e

        if resp.status_code != 201:
            error_data = resp.json()
            logger.error(f"Error creando preferencia: {error_data}")
            raise Exception(f"Error creando preferencia MP: {error_data}")

        init_point = resp.json().get("init_point")
        logger.info(f"Link de pago generado (init_point): {init_point}")
        logger.info("=== Fin creación preferencia Mercado Pago ===")

        return init_point