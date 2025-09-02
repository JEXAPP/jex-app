from datetime import date, timezone
import random

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def get_username_from_email(email):
    """
    Extracts the username part from an email address.
    """
    return email.split('@')[0] if '@' in email else email


def calculate_age(birth_date):
    if not birth_date:
        return None
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


def get_city_country(address):
    """
    Devuelve solo ciudad y país, cortando calle y otros detalles.
    Supone que address es algo como "Calle Falsa 123, Ciudad, Provincia, País"
    """
    if not address:
        return None
    parts = address.split(",")
    if len(parts) < 2:
        return address.strip()
    return ", ".join([p.strip() for p in parts[-2:]])