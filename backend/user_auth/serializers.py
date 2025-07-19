import re
from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from .models import CustomUser, EmployerProfile, EmployeeProfile
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from user_auth.models import EmployeeProfile, CustomUser

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
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        phone = validated_data['phone']
        company_name = validated_data['company_name']
        
        # El username será la parte antes del @
        username = get_username_from_email(email)
        
        user = CustomUser.objects.create(
            username=username,
            email=email,
            phone=phone,
            role='employer',
            password=make_password(password)
        )

        EmployerProfile.objects.create(
            user=user,
            company_name=company_name
        )

        return user


class EmployeeRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    
    dni = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255, allow_blank=True, required=False)
    birth_date = serializers.DateField(input_formats=["%d/%m/%Y"], required=False)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_dni(self, value):
        if EmployeeProfile.objects.filter(dni=value).exists():
            raise serializers.ValidationError("DNI is already in use.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        phone = validated_data['phone']
        dni = validated_data['dni']
        address = validated_data.get('address', '')
        birth_date = validated_data.get('birth_date', None)

        username = get_username_from_email(email)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            phone=phone,
            role='employee',
            password=make_password(password)
        )

        EmployeeProfile.objects.create(
            user=user,
            dni=dni,
            address=address,
            birth_date=birth_date
        )

        return user

class CompleteEmployerSocialSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    company_name = serializers.CharField(max_length=255)

    def validate(self, data):
        user = self.context['request'].user

        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        if hasattr(user, 'employer_profile'):
            raise serializers.ValidationError("Employer profile is already completed.")

        return data

    def save(self):
        user = self.context['request'].user
        user.phone = self.validated_data['phone']
        user.role = EMPLOYER_ROLE
        user.save()

        EmployerProfile.objects.create(
            user=user,
            company_name=self.validated_data['company_name']
        )

        return user
    

class CompleteEmployeeSocialSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    dni = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False)

    def validate(self, data):
        user = self.context['request'].user
        

        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        if hasattr(user, 'employee_profile'):
            raise serializers.ValidationError("Employee profile is already completed.")

        if EmployeeProfile.objects.filter(dni=data['dni']).exists():
            raise serializers.ValidationError("DNI is already in use.")

        return data

    def save(self):
        user = self.context['request'].user

        user.phone = self.validated_data['phone']
        user.role = EMPLOYEE_ROLE 

        user.save()

        EmployeeProfile.objects.create(
            user=user,
            dni=self.validated_data['dni'],
            address=self.validated_data.get('address', ''),
            birth_date=self.validated_data.get('birth_date', None)
        )

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

class SendCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)

    def validate_phone_number(self, value):
        if not re.match(r'^\+[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Phone format invalid. Use international format (+5491234567890)")
        return value

class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    code = serializers.CharField(max_length=6)