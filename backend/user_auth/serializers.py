from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from .models import CustomUser, EmployerProfile, EmployeeProfile
from rest_framework.exceptions import AuthenticationFailed

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Define que se use email en lugar de username

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email is None or password is None:
            raise AuthenticationFailed("Email and password are required.")

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            raise AuthenticationFailed("Invalid email or password.")

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token
    
class EmployerRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    dni = serializers.CharField()
    phone = serializers.CharField()

    def save(self, user=None):
        data = self.validated_data

        # Si ya hay un usuario (vía Google)
        if user:
            user.dni = data['dni']
            user.phone = data['phone']
            user.role = EMPLOYER_ROLE
            user.save()
        else:
            user = CustomUser.objects.create_user(
                username=data.get('username', data['email']),
                email=data['email'],
                password=data['password'],
                dni=data['dni'],
                phone=data['phone'],
                role=EMPLOYER_ROLE
            )

        group, _ = Group.objects.get_or_create(name=EMPLOYER_ROLE)
        user.groups.add(group)
        EmployerProfile.objects.create(user=user)
        return user

class EmployeeRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    dni = serializers.CharField()
    phone = serializers.CharField()

    def save(self, user=None):
        data = self.validated_data

        if user:
            user.dni = data['dni']
            user.phone = data['phone']
            user.role = 'employee'
            user.save()
        else:
            user = CustomUser.objects.create_user(
                username=data.get('username', data['email']),
                email=data['email'],
                password=data['password'],
                dni=data['dni'],
                phone=data['phone'],
                role=EMPLOYEE_ROLE
            )

        group, _ = Group.objects.get_or_create(name=EMPLOYEE_ROLE)
        user.groups.add(group)
        EmployeeProfile.objects.create(user=user)
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)


class PasswordResetCompleteSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

# class AssignRoleSerializer(serializers.Serializer):
#     user_id = serializers.IntegerField()
#     role = serializers.ChoiceField(choices=['empleador', 'empleado'])

#     def validate_user_id(self, value):
#         if not User.objects.filter(id=value).exists():
#             raise serializers.ValidationError("Usuario no encontrado.")
#         return value

#     def save(self):
#         user_id = self.validated_data['user_id']
#         role = self.validated_data['role']
#         user = User.objects.get(id=user_id)
#         user.groups.clear()
#         group, _ = Group.objects.get_or_create(name=role)
#         user.groups.add(group)
#         user.save()
#         return user