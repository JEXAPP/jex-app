from django.db import models
from user_auth.models.user import CustomUser

class EmployerProfile(models.Model):
    company_name = models.CharField(max_length=255)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='employer_profile')
    

    def __str__(self):
        return f"{self.user.email} - Employer"