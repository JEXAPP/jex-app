from django.db import models
from eventos.models.job_types import JobType
from user_auth.models.user import CustomUser

class EmployeeProfile(models.Model):
    dni = models.CharField(max_length=20, unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    job_types = models.ManyToManyField(JobType, blank=True, null=True, related_name='employees')

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='employee_profile')
    description = models.CharField(max_length=200, blank=True, null=True)


    def __str__(self):
        return f"{self.user.email} - Employee"