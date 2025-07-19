from django.db import models
from user_auth.models.user import CustomUser

class EmployeeProfile(models.Model):
    dni = models.CharField(max_length=20, unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)


    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='employee_profile')


    def __str__(self):
        return f"{self.user.email} - Employee"