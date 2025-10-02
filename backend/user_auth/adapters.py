from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        """
        Sobrescribimos populate_user para evitar que allauth
        intente pisar el campo 'phone' cuando viene de Google.
        """

        data.pop("phone", None)
        data.pop("phone_number", None)
        data.pop("phoneNumbers", None)
        
        user = super().populate_user(request, sociallogin, data)


        return user
