from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from user_auth.services.twilio import TwilioService
from django.utils import timezone
from datetime import timedelta
from user_auth.models.validation import PhoneVerification
from user_auth.serializers.phone_verification import SendCodeSerializer, VerifyCodeSerializer

class SendPhoneVerificationCodeView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = SendCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            
            # Check if phone number exists and is verified
            existing = PhoneVerification.objects.filter(
                phone=phone,
                is_verified=True
            ).first()
            
            if existing:
                return Response({
                    'error': 'This phone number is already verified.',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Send code using Twilio
            twilio_service = TwilioService()
            result = twilio_service.send_verification_code(phone)
            
            if result['success']:
                # Create or update PhoneVerification entry
                phone_verification, created = PhoneVerification.objects.update_or_create(
                    phone=phone,
                    defaults={
                        'is_verified': False,
                        'verified_at': None,
                        'expires_at': timezone.now() + timedelta(minutes=10)  # 10 mins
                    }
                )
                
                action = "enviado" if created else "reenviado"
                return Response({
                    'message': f'Código {action} correctamente',
                    'phone': phone,
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
            phone = serializer.validated_data['phone']
            code = serializer.validated_data['code']
            
            # Check if phone number exists and is not verified
            try:
                phone_verification = PhoneVerification.objects.get(
                    phone=phone
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
            result = twilio_service.verify_code(phone, code)
            
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