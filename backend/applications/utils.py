from vacancies.constants import JobTypesEnum
import jwt
from datetime import datetime, timedelta
from django.conf import settings


def get_job_type_display(vacancy):
    """
    Devuelve solo el nombre del job_type de la vacante.
    - Si el job_type es 'Otro', retorna specific_job_type
    - Si es normal, retorna job_type.name
    """
    job_type = vacancy.job_type
    if job_type.name == JobTypesEnum.OTRO.value:
        return vacancy.specific_job_type
    return job_type.name


def generate_qr_token(offer_id: int, employee_id: int) -> str:
    """
    Genera un token JWT para QR de asistencia de un empleado.
    """
    payload = {
        "offer_id": offer_id,
        "employee_id": employee_id,
        "exp": datetime.utcnow() + timedelta(minutes=settings.QR_JWT_EXP_MINUTES),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, settings.QR_JWT_SECRET, algorithm=settings.QR_JWT_ALGORITHM)
    return token


def decode_qr_token(token: str) -> dict:
    """
    Decodifica un JWT generado para QR y devuelve su payload.
    Lanza excepción si el token es inválido o expirado.
    """
    try:
        payload = jwt.decode(
            token,
            settings.QR_JWT_SECRET,
            algorithms=[settings.QR_JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired.")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token.")