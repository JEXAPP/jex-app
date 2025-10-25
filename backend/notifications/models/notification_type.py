from django.db import models
from media_utils.models import Image 

class NotificationType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    image = models.OneToOneField(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notification_type_image'
    )
