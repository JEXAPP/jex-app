import requests
from notifications.models.notification import Notification
from notifications.models.notification_type import NotificationType


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
    tokens = list(user.devices.values_list('expo_push_token', flat=True))
    for token in tokens:
        payload = {
            "to": token,
            "sound": "default",
            "title": title,
            "body": message,
            "data": {"type": notification_type_name}
        }
        try:
            requests.post("https://exp.host/--/api/v2/push/send", json=payload, timeout=5)
        except requests.RequestException:
            pass
            