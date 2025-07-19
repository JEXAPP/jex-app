from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class TwilioService:
    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.verify_service_sid = settings.TWILIO_VERIFY_SERVICE_SID

    def send_verification_code(self, phone_number):
        """Send a verification code to the provided phone number using Twilio's Verify service."""
        try:
            verification = self.client.verify \
                .v2 \
                .services(self.verify_service_sid) \
                .verifications \
                .create(to=phone_number, channel='sms')
            
            return {
                'success': True,
                'status': verification.status,
                'message': 'Code sent successfully',
            }
        except TwilioException as e:
            logger.error(f"Error sending code: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error sending verification code'
            }

    def verify_code(self, phone_number, code):
        """Check if the provided code is valid"""
        try:
            verification_check = self.client.verify \
                .v2 \
                .services(self.verify_service_sid) \
                .verification_checks \
                .create(to=phone_number, code=code)
            
            return {
                'success': verification_check.status == 'approved',
                'status': verification_check.status,
                'message': 'Código verificado' if verification_check.status == 'approved' else 'Invalid code'
            }
        except TwilioException as e:
            logger.error(f"Error verifying code: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error verifying code'
            }