from rest_framework import serializers
from media_utils.models import Image, ImageType
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYER_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employer import EmployerProfile 
from django.contrib.auth.models import Group
from django.db.models import Q


from django.contrib.auth.hashers import make_password

class EmployerRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya esta en uso")
        return value
    
    def validate_phone(self, value):
        if CustomUser.objects.filter(phone=value).exists():
            raise serializers.ValidationError("El telefono ya esta en uso")
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

        group, _ = Group.objects.get_or_create(name='employer')
        user.groups.add(group)

        EmployerProfile.objects.create(
            user=user,
            company_name=company_name
        )

        return user


class CompleteEmployerSocialSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    company_name = serializers.CharField(max_length=255)

    def validate(self, data):
        user = self.context['request'].user

        if not user.is_authenticated:
            raise serializers.ValidationError("El usuario debe estar autenticado")

        if hasattr(user, 'employer_profile'):
            raise serializers.ValidationError("El perfil de empresa ya esta completado")
        
        if CustomUser.objects.filter(Q(phone=data['phone']) & ~Q(id=user.id)).exists():
            raise serializers.ValidationError("El telefono ya esta en uso")

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

        employer_group, created = Group.objects.get_or_create(name='employer')
        user.groups.add(employer_group)

        return user
    

class EmployerProfileDescriptionSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.URLField(required=False, allow_null=True)
    profile_image_id = serializers.CharField(required=False, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = EmployerProfile
        fields = ['description', 'profile_image_url', 'profile_image_id']

    def validate(self, attrs):
        url, img_id = attrs.get('profile_image_url'), attrs.get('profile_image_id')
        if (url and not img_id) or (img_id and not url):
            raise serializers.ValidationError(
                "Both 'profile_image_url' and 'profile_image_id' must be provided together."
            )
        return attrs

    def update(self, instance, validated_data):
        user = instance.user

        if 'description' in validated_data:
            instance.description = validated_data['description']

        url, img_id = validated_data.get('profile_image_url'), validated_data.get('profile_image_id')
        if url and img_id:
            image_obj, _ = Image.objects.update_or_create(
                public_id=img_id,
                defaults={'url': url, 'type': ImageType.PROFILE, 'uploaded_by': user}
            )
            user.profile_image = image_obj
            user.save()

        instance.save()
        return instance


class ViewEmployerProfileDescriptionSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    profile_image_id = serializers.SerializerMethodField()

    class Meta:
        model = EmployerProfile
        fields = ['id', 'company_name', 'description', 'profile_image_url', 'profile_image_id']

    def get_profile_image_url(self, obj):
        if obj.user.profile_image:
            return obj.user.profile_image.url
        return None

    def get_profile_image_id(self, obj):
        if obj.user.profile_image:
            return obj.user.profile_image.public_id
        return None
    

class UpdateEmployerProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.CharField(allow_null=True, required=False)
    profile_image_id = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = EmployerProfile
        fields = ['company_name', 'description', 'profile_image_url', 'profile_image_id']

    def validate(self, data):
        image_url = data.get('profile_image_url')
        image_id = data.get('profile_image_id')

        # Si el front manda cualquier cosa, debe mandar ambos
        if (image_url and not image_id) or (image_id and not image_url):
            raise serializers.ValidationError("Both profile_image_url and profile_image_id are required.")
        
        return data

    def update(self, instance, validated_data):
        user = self.context['user']

        # Obtener campos de imagen
        image_url = validated_data.pop('profile_image_url', None)
        image_id = validated_data.pop('profile_image_id', None)

        # Si se envía imagen nueva
        if image_url and image_id:
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

        # Si envían ambos como null → borrar imagen
        elif image_url is None and image_id is None:
            user.profile_image = None
            user.save()

        # Actualizar el employer profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance