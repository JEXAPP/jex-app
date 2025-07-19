from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Define que se use email en lugar de username

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email is None or password is None:
            raise AuthenticationFailed("Email and password are required.")

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            raise AuthenticationFailed("Invalid email or password.")

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token