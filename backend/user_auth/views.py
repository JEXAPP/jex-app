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

from user_auth.services import TwilioService
from .utils import generate_otp
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.contrib.auth.models import Group
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from user_auth.models import PasswordResetOTP, CustomUser, PhoneVerification
from .serializers import CompleteEmployeeSocialSerializer, CompleteEmployerSocialSerializer, EmailTokenObtainPairSerializer, EmployerRegisterSerializer, EmployeeRegisterSerializer, PasswordResetCompleteSerializer, PasswordResetRequestSerializer, PasswordResetVerifySerializer, SendCodeSerializer, VerifyCodeSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
class EmployerRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
    
class CompleteEmployerSocialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompleteEmployerSocialSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employer profile completed'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteEmployeeSocialView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CompleteEmployeeSocialSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee profile completed'}, status=status.HTTP_200_OK)
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

class SendPhoneVerificationCodeView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = SendCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone']
            
            # Check if phone number exists and is verified
            existing = PhoneVerification.objects.filter(
                phone_number=phone_number,
                is_verified=True
            ).first()
            
            if existing:
                return Response({
                    'error': 'This phone number is already verified.',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Send code using Twilio
            twilio_service = TwilioService()
            result = twilio_service.send_verification_code(phone_number)
            
            if result['success']:
                # Create or update PhoneVerification entry
                phone_verification, created = PhoneVerification.objects.update_or_create(
                    phone_number=phone_number,
                    defaults={
                        'is_verified': False,
                        'verified_at': None,
                        'expires_at': timezone.now() + timedelta(minutes=10)  # 10 mins
                    }
                )
                
                action = "enviado" if created else "reenviado"
                return Response({
                    'message': f'Código {action} correctamente',
                    'phone_number': phone_number,
                    'expires_in_minutes': 10
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyPhoneCodeView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            code = serializer.validated_data['code']
            
            # Check if phone number exists and is not verified
            try:
                phone_verification = PhoneVerification.objects.get(
                    phone_number=phone_number
                )
                
                # If exprired, reccomend to request a new code
                if timezone.now() > phone_verification.expires_at:
                    return Response({
                        'error': 'The code has expired. Please request a new code.',
                        'message': 'Request a new code',
                        'verified': False,
                        'expired': True
                    }, status=status.HTTP_400_BAD_REQUEST)
                
            except PhoneVerification.DoesNotExist:
                return Response({
                    'error': 'First request a code',
                    'verified': False
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check the code using Twilio
            twilio_service = TwilioService()
            result = twilio_service.verify_code(phone_number, code)
            
            if result['success']:
                # Mark as verified
                phone_verification.is_verified = True
                phone_verification.verified_at = timezone.now()
                phone_verification.save()
                
                return Response({
                    'message': 'Phone number verified successfully',
                    'verified': True
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': result['message'],
                    'verified': False
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)