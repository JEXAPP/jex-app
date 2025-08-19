from user_auth.models.user import CustomUser
from user_auth.models.employer import EmployerProfile

def create_employer_user(email="employer@example.com", password="password123", phone="123456789", company_name="My Company"):
    """
    Fixture helper para crear un usuario employer con perfil.
    Devuelve la tupla (user, profile)
    """
    user = CustomUser.objects.create_user(
        email=email,
        password=password,
        phone=phone,
        role="employer"
    )
    profile = EmployerProfile.objects.create(
        user=user,
        company_name=company_name
    )
    return user, profile