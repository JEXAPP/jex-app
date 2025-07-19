from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from ..utils import generate_otp
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from user_auth.models.user import CustomUser
from user_auth.models.validation import PasswordResetOTP
from user_auth.serializers.password_reset import PasswordResetCompleteSerializer, PasswordResetRequestSerializer, PasswordResetVerifySerializer 

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

class PasswordResetVerifyView(GenericAPIView):
    serializer_class = PasswordResetVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']

        try:
            user = CustomUser.objects.get(email=email)
            otp_entry = PasswordResetOTP.objects.get(user=user, otp_code=otp_code)
        except (CustomUser.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"detail": "Email o código inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_entry.is_valid():
            return Response({"detail": "El código expiró."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Código verificado correctamente."}, status=status.HTTP_200_OK)

class PasswordResetCompleteView(GenericAPIView):
    serializer_class = PasswordResetCompleteSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        new_password = serializer.validated_data['new_password']

        try:
            user = CustomUser.objects.get(email=email)
            otp_entry = PasswordResetOTP.objects.get(user=user, otp_code=otp_code)
        except (CustomUser.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"detail": "Email o código inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_entry.is_valid():
            return Response({"detail": "El código expiró."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        otp_entry.delete()

        return Response({"detail": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)