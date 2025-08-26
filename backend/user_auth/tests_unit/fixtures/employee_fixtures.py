from user_auth.models.user import CustomUser
from user_auth.models.employee import EmployeeProfile

from django.contrib.auth.models import Group

def create_employee_user(email="employee@example.com", password="password123", phone="123456789", dni="12345678"):
    user = CustomUser.objects.create_user(
        email=email,
        password=password,
        phone=phone,
        role="employee"
    )
    EmployeeProfile.objects.create(
        user=user,
        dni=dni
    )
    # Agregar al grupo de empleados
    group, _ = Group.objects.get_or_create(name='employee')
    user.groups.add(group)
    return user