from django.db import models

class NotificationType(models.Model):
    name = models.CharField(max_length=50, unique=True)
