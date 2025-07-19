from datetime import timezone
import random

from user_auth.models import PhoneVerification

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def get_username_from_email(email):
    """
    Extracts the username part from an email address.
    """
    return email.split('@')[0] if '@' in email else email

def is_phone_verified(phone_number):
    """
    Checks if the phone number is verified.
    Returns True if verified, False otherwise.
    """
    try:
        verification = PhoneVerification.objects.get(
            phone_number=phone_number,
            is_verified=True
        )
        return True
    except PhoneVerification.DoesNotExist:
        return False