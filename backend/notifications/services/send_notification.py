import requests
import logging
from config import settings
from notifications.models.notification import Notification
from notifications.models.notification_type import NotificationType

# Configuramos el logger (una sola vez en tu módulo)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Nivel mínimo de log

# Opcional: agregar handler si no hay uno configurado (para desarrollo local)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s %(name)s: %(message)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

def send_notification(user, title, message, notification_type_name):
    """
    Crea una notificación en la base de datos y envía push a todos los dispositivos del usuario.
    
    :param user: instancia de CustomUser
    :param title: título de la notificación
    :param message: mensaje de la notificación
    :param notification_type_name: nombre del NotificationType (string)
    """
    try:
        notif_type = NotificationType.objects.get(name=notification_type_name)
    except NotificationType.DoesNotExist:
        raise ValueError(f"NotificationType '{notification_type_name}' no existe.")

    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notif_type
    )

    # Enviar push a todos los dispositivos del usuario
    # tokens = list(user.devices.values_list('expo_push_token', flat=True))
    # for token in tokens:
    payload = {
        "to": "ExponentPushToken[xWQq0cL6DMc8SYTT-FeuM8]",
        "sound": "default",
        "title": title,
        "body": message,
        "data": {"type": notification_type_name}
    }
    try:
        resp = requests.post(settings.EXPO_PUSH_API_URL, json=payload, timeout=5)
        if resp.status_code == 200:
            logger.info(
                "Push enviado a token %s | HTTP %s | Response: %s",
                payload["to"], resp.status_code, resp.text
            )
        else:
            logger.warning(
                "Error al enviar push a token %s | HTTP %s | Response: %s",
                payload["to"], resp.status_code, resp.text
            )
    except requests.RequestException as e:
        logger.error("Error de red al enviar push a token %s: %s", payload["to"], e)