from django.db import models
from django.utils import timezone
from user_auth.models.user import CustomUser

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.valid_until
    

class PhoneVerification(models.Model):
    phone = models.CharField(max_length=15, unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.phone} - {'Verificado' if self.is_verified else 'Pendiente'}"