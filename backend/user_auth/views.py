from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import generate_otp
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.contrib.auth.models import Group
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from user_auth.models import PasswordResetOTP, CustomUser
from .serializers import EmailTokenObtainPairSerializer, EmployerRegisterSerializer, EmployeeRegisterSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
class EmployerRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) if request.user.is_authenticated else serializer.save()
            return Response({'message': 'Employer registered'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployeeRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) if request.user.is_authenticated else serializer.save()
            return Response({'message': 'Employee registered successfully'}, status=status.HTTP_200_OK)
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


class PasswordResetRequestView(GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # No revelamos si existe el email
            return Response({"detail": "Si el email existe, se envió un código de recuperación."}, status=status.HTTP_200_OK)

        # Generar OTP y guardar
        otp = generate_otp()
        valid_until = timezone.now() + timedelta(minutes=5)  # válido 5 minutos

        # Guardar o actualizar OTP para el usuario
        PasswordResetOTP.objects.update_or_create(
            user=user,
            defaults={
                'otp_code': otp,
                'valid_until': valid_until
            }
        )

        # Enviar mail con el OTP
        subject = "Código para restablecer tu contraseña"
        message = f"Hola {user.username},\n\nTu código para restablecer la contraseña es: {otp}\nEste código es válido por 5 minutos.\n\nSi no solicitaste este código, ignora este mensaje."
        send_mail(subject, message, None, [user.email])

        return Response({"detail": "Si el email existe, se envió un código de recuperación."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        new_password = serializer.validated_data['new_password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Email o código inválido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_entry = PasswordResetOTP.objects.get(user=user, otp_code=otp_code)
        except PasswordResetOTP.DoesNotExist:
            return Response({"detail": "Email o código inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_entry.is_valid():
            return Response({"detail": "El código expiró."}, status=status.HTTP_400_BAD_REQUEST)

        # Cambiar contraseña
        user.set_password(new_password)
        user.save()

        # Borrar OTP para no reutilizarlo
        otp_entry.delete()

        return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)

# class AssignRoleView(APIView):
#     def post(self, request):
#         serializer = AssignRoleSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({
#                 "message": f"Rol '{user.groups.first().name}' asignado al usuario {user.username}."
#             }, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)