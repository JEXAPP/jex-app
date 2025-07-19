from rest_framework import serializers
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employee import EmployeeProfile # CAMBIAR ESTO
from django.contrib.auth.hashers import make_password

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