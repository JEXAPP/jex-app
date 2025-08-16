from rest_framework import serializers
from vacancies.models.job_types import JobType
from vacancies.serializers.job_types import ListJobTypesSerializer
from media_utils.models import Image, ImageType
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYEE_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employee import EmployeeProfile
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


class EmployeeAdditionalInfoSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    job_types = serializers.PrimaryKeyRelatedField(
        queryset=JobType.objects.all(),
        many=True,
        required=False,
    )
    profile_image_url = serializers.URLField(required=False, allow_null=True)
    profile_image_id = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = EmployeeProfile
        fields = ['description', 'job_types', 'profile_image_url', 'profile_image_id']

    def validate(self, attrs):
        image_url = attrs.get('profile_image_url')
        image_id = attrs.get('profile_image_id')

        if (image_url and not image_id) or (image_id and not image_url):
            raise serializers.ValidationError(
                "Both 'profile_image_url' and 'profile_image_id' must be provided together."
            )
        return attrs

    def update(self, instance, validated_data):
        user = instance.user

        # Actualizamos solo si están presentes y no son None
        if 'description' in validated_data and validated_data['description'] is not None:
            instance.description = validated_data['description']

        if 'job_types' in validated_data and validated_data['job_types'] is not None:
            instance.job_types.set(validated_data['job_types'])

        image_url = validated_data.get('profile_image_url')
        image_id = validated_data.get('profile_image_id')

        if image_url is not None and image_id is not None:
            image_obj, _ = Image.objects.update_or_create(
                public_id=image_id,
                defaults={
                    'url': image_url,
                    'type': ImageType.PROFILE,
                    'uploaded_by': user,
                }
            )
            user.profile_image = image_obj
            user.save()

        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['job_types'] = ListJobTypesSerializer(instance.job_types.all(), many=True).data

        profile_img = instance.user.profile_image
        if profile_img:
            rep['profile_image_url'] = profile_img.url
            rep['profile_image_id'] = profile_img.public_id
        else:
            rep['profile_image_url'] = None
            rep['profile_image_id'] = None

        return rep