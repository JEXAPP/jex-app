from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import AssignRoleSerializer, UserRegistrationSerializer
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
              "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class AssignRoleView(APIView):
    def post(self, request):
        serializer = AssignRoleSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": f"Rol '{user.groups.first().name}' asignado al usuario {user.username}."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)