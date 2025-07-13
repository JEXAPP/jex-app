from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from django.contrib.auth import get_user_model

User = get_user_model()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        # Esto se ejecuta ANTES de guardar el usuario
        user = super().populate_user(request, sociallogin, data)
        user.username = data.get('email')
        user.email = data.get('email')
        # NO asignamos role todavía, ni otros campos
        return user