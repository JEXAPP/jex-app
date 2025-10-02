from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        """
        Sobrescribimos populate_user para evitar que allauth
        intente pisar el campo 'phone' cuando viene de Google.
        """
        user = super().populate_user(request, sociallogin, data)

        # Google a veces trae 'phoneNumbers' en el perfil,
        # pero no queremos guardarlo porque nuestro modelo
        # tiene phone como unique.
        if hasattr(user, "phone"):
            user.phone = user.phone or ""

        return user
