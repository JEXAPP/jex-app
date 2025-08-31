from user_auth.models.user import CustomUser

def create_user_for_login(email="user@example.com", password="password123", role="employee", phone="123456789"):
    return CustomUser.objects.create_user(
        email=email,
        password=password,
        phone=phone,
        role=role
    )