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
    Extrae barrio y provincia de un string de Google Autocomplete.
    Formato esperado: "Calle Numero, Barrio, Provincia, Pais".
    Devuelve:
      - "Barrio, Provincia" si hay al menos 3 partes antes del país,
      - "Provincia" o el único valor disponible si hay menos partes,
      - None si la entrada es vacía.
    """
    if not address:
        return None

    parts = [p.strip() for p in address.split(",") if p.strip()]
    if not parts:
        return None

    if len(parts) >= 3:
        barrio = parts[-3]
        provincia = parts[-2]
        return f"{barrio}, {provincia}"
    return parts[0]
