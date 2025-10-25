from django.db import models
from user_auth.models.user import CustomUser

class Device(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='devices')
    expo_push_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)