from user_auth.constants import EMPLOYER_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employer import EmployerProfile
from django.contrib.auth.models import Group

def create_employer_user(email="employer@example.com", password="password123", phone="123456789", company_name="My Company"):
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
    # Agregar al grupo de empleadores
    group, _ = Group.objects.get_or_create(name='employer')
    user.groups.add(group)
    return user, profile