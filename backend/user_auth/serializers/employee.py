from datetime import date
from rest_framework import serializers
from applications.errors.offer_messages import INVALID_RANGE_DATE, INVALID_RANGE_TIME, MISSING_PROVINCE
from eventos.formatters.date_time import CustomDateField
from vacancies.formatters.date_time import CustomTimeField
from vacancies.models.job_types import JobType
from vacancies.serializers.job_types import ListJobTypesSerializer
from media_utils.models import Image, ImageType
from user_auth.utils import calculate_age, get_city_locality, get_username_from_email
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

    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya esta en uso")
        return value

    def validate_dni(self, value):
        if EmployeeProfile.objects.filter(dni=value).exists():
            raise serializers.ValidationError("El DNI ya esta en uso")
        return value
    
    def validate_phone(self, value):
        if CustomUser.objects.filter(phone=value).exists():
            raise serializers.ValidationError("El telefono ya esta en uso")
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
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']

        username = get_username_from_email(email)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            phone=phone,
            first_name=first_name,
            last_name=last_name,
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
            raise serializers.ValidationError("El usuario debe estar autenticado")

        if hasattr(user, 'employee_profile'):
            raise serializers.ValidationError("El perfil de empleado ya esta completado")

        if EmployeeProfile.objects.filter(dni=data['dni']).exists():
            raise serializers.ValidationError("El DNI ya esta en uso")
    
        if CustomUser.objects.filter(Q(phone=data['phone']) & ~Q(id=user.id)).exists():
            raise serializers.ValidationError("El telefono ya esta en uso")

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


class EmployeeForSearchSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    job_types = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    approximate_location = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = ["profile_image", "name", "job_types", "description", "age", "approximate_location"]

    def get_profile_image(self, obj):
        return obj.user.profile_image.url if obj.user.profile_image else None

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_job_types(self, obj):
        return [jt.name for jt in obj.job_types.all()]

    def get_age(self, obj):
        return calculate_age(obj.birth_date)

    def get_approximate_location(self, obj):
        return get_city_locality(obj.address)
    
class EmployeeProfileSearchSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField(source="id")
    profile_image = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    approximate_location = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = ["employee_id", "profile_image", "name", "approximate_location"]

    def get_profile_image(self, obj):
        return obj.user.profile_image.url if obj.user.profile_image else None

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_approximate_location(self, obj):
        return get_city_locality(obj.address)

class EmployeeSearchFilterSerializer(serializers.Serializer):
    province = serializers.CharField(required=False, allow_blank=True)
    locality = serializers.CharField(required=False, allow_blank=True)

    start_date = CustomDateField(required=False)
    end_date = CustomDateField(required=False)
    start_time = CustomTimeField(required=False)
    end_time = CustomTimeField(required=False)

    min_stars = serializers.IntegerField(required=False, min_value=1)
    min_jobs = serializers.IntegerField(required=False, min_value=0)

    def validate(self, data):
        if data.get("locality") and not data.get("province"):
            raise serializers.ValidationError(MISSING_PROVINCE)

        if data.get("start_date") and data.get("end_date"):
            if data["start_date"] > data["end_date"]:
                raise serializers.ValidationError(INVALID_RANGE_DATE)

        if data.get("start_time") and data.get("end_time"):
            if data["start_time"] > data["end_time"]:
                raise serializers.ValidationError(INVALID_RANGE_TIME)

        return data