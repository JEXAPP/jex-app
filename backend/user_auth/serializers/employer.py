from rest_framework import serializers
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYER_ROLE
from user_auth.models.user import CustomUser
from user_auth.models.employer import EmployerProfile 
from django.contrib.auth.models import Group

from django.contrib.auth.hashers import make_password

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

        employer_group, created = Group.objects.get_or_create(name='employer')
        user.groups.add(employer_group)

        return user