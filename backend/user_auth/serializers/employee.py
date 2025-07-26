from rest_framework import serializers
from config.services.cloudinary import upload_image
from eventos.models.job_types import JobType
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employee import EmployeeProfile # CAMBIAR ESTO
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.db.models import Q

class EmployeeRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    
    dni = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255, allow_blank=True, required=False)
    birth_date = serializers.DateField(input_formats=["%d/%m/%Y"], required=False)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_dni(self, value):
        if EmployeeProfile.objects.filter(dni=value).exists():
            raise serializers.ValidationError("DNI is already in use.")
        return value
    
    def validate_phone(self, value):
        if CustomUser.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone is already in use.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        phone = validated_data['phone']
        dni = validated_data['dni']
        address = validated_data.get('address', '')
        birth_date = validated_data.get('birth_date', None)
        latitude = validated_data.get('latitude')
        longitude = validated_data.get('longitude')

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
            birth_date=birth_date,
            latitude=latitude,
            longitude=longitude
        )

        # Agregar grupo 'employee' para permisos
        employee_group, created = Group.objects.get_or_create(name='employee')
        user.groups.add(employee_group)

        return user

class CompleteEmployeeSocialSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    dni = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)

    def validate(self, data):
        user = self.context['request'].user
        

        if not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        if hasattr(user, 'employee_profile'):
            raise serializers.ValidationError("Employee profile is already completed.")

        if EmployeeProfile.objects.filter(dni=data['dni']).exists():
            raise serializers.ValidationError("DNI is already in use.")
    
        if CustomUser.objects.filter(Q(phone=data['phone']) & ~Q(id=user.id)).exists():
            raise serializers.ValidationError("Phone is already in use.")

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
            birth_date=self.validated_data.get('birth_date', None),
            latitude=self.validated_data.get('latitude'),
            longitude=self.validated_data.get('longitude')
        )

        employee_group, created = Group.objects.get_or_create(name='employee')
        user.groups.add(employee_group)

        return user


class EmployeeAdditionalInfoSerializer(serializers.Serializer):
    description = serializers.CharField(required=False, allow_blank=True)
    job_types = serializers.ListField(
        child=serializers.IntegerField(), required=False
    )
    profile_image = serializers.ImageField(required=False)

    def validate_job_types(self, value):
        if not JobType.objects.filter(id__in=value).count() == len(value):
            raise serializers.ValidationError("Algunos job_types no existen.")
        return value

    def update(self, instance, validated_data):
        user = instance.user

        # Imagen
        image = validated_data.get('profile_image')
        if image:
            upload_result = upload_image(image, folder="user_profiles")
            user.profile_image_url = upload_result['url']
            user.profile_image_id = upload_result['public_id']
            user.save()

        # Descripción
        if 'description' in validated_data:
            instance.description = validated_data['description']

        # Job types
        if 'job_types' in validated_data:
            instance.job_types.set(validated_data['job_types'])

        instance.save()
        return instance
