from django.db import models

from notifications.models.notification_type import NotificationType
from user_auth.models.user import CustomUser

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, related_name='notifications', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    notification_type = models.ForeignKey(
        NotificationType, 
        on_delete=models.PROTECT,
        related_name='notifications'
    )
    created_at = models.DateTimeField(auto_now_add=True)