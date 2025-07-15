from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db import models
from django.utils import timezone
import datetime
from user_auth.constants import EMPLOYEE_ROLE, EMPLOYER_ROLE

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    dni = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=20)

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
    
class EmployerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='employer_profile')

    def __str__(self):
        return f"{self.user.username} - Employer"

class EmployeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='employee_profile')


    def __str__(self):
        return f"{self.user.username} - Employee"


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.valid_until