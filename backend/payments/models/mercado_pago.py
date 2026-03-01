from django.db import models

from user_auth.models.user import CustomUser



class MercadoPagoAccount(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="mercado_pago_account"
    )
    mp_user_id = models.BigIntegerField(unique=True)
    access_token = models.TextField()  # Token para operar
    refresh_token = models.TextField()  # Para renovar access_token
    public_key = models.CharField(max_length=200, blank=True, null=True)
    live_mode = models.BooleanField(default=False)
    expires_in = models.IntegerField(null=True, blank=True)  # segundos de expiración
    scope = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"MercadoPagoAccount({self.user.email})"