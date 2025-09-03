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


def get_city_locality(address):
    """
    Extrae localidad y ciudad de un string de Google Autocomplete.
    Devuelve 'localidad, ciudad' o solo ciudad si no hay localidad.
    """
    if not address:
        return None
    
    parts = [p.strip() for p in address.split(",")]
    if len(parts) < 2:
        return address.strip()  # Devuelve lo que haya si es muy corto
    
    # Última parte es el país, ignoramos
    # Tomamos las dos partes antes del país
    city = parts[-2]
    if len(parts) >= 3:
        locality = parts[-3]
        return f"{locality}, {city}"
    else:
        return city