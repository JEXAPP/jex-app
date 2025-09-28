from django.conf import settings
import requests

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
