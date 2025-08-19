from user_auth.models.user import CustomUser
from user_auth.models.employee import EmployeeProfile

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
    return user