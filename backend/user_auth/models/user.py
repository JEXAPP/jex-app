from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from media_utils.models import Image
from user_auth.utils import get_username_from_email
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)

        # Obtener la parte antes del @ para username
        extra_fields.setdefault('username', get_username_from_email(email))

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        # También asegurarse que username esté seteado aquí
        if 'username' not in extra_fields or not extra_fields['username']:
            extra_fields['username'] = get_username_from_email(email)


        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    phone = models.CharField(max_length=20, null=False, blank=False, unique=True)

    profile_image = models.OneToOneField(
        Image,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_profile_image'
    )


    ROLE_CHOICES = [
        ('employer', 'Employer'),
        ('employee', 'Employee'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def is_employer(self):
        return self.role == EMPLOYER_ROLE

    def is_employee(self):
        return self.role == EMPLOYEE_ROLE
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 
    objects = CustomUserManager() 