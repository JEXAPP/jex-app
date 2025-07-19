from rest_framework import status, permissions
from rest_framework.response import Response
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.views import APIView

from user_auth.serializers.auth import EmailTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Sesión cerrada correctamente"}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"error": "No se proporcionó refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"error": "Token inválido o ya expirado"}, status=status.HTTP_400_BAD_REQUEST)

class CustomGoogleLoginView(SocialLoginView):

    adapter_class = GoogleOAuth2Adapter
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        user = self.user  # Usuario que se autenticó
        if user is None:
            return response  # algo falló antes

        # Obtener los tokens de nuevo (porque `super().post()` no nos da acceso directo)
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        # Evaluar si el usuario tiene datos incompletos
        incomplete = True
        if user.role:
            incomplete = False

        return Response({
            "access": access,
            "refresh": str(refresh),
            "incomplete_user": incomplete
        }, status=status.HTTP_200_OK)
