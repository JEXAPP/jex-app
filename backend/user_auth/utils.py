from datetime import timezone
import random

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def get_username_from_email(email):
    """
    Extracts the username part from an email address.
    """
    return email.split('@')[0] if '@' in email else email