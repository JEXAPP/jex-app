from django.db import models

from media_utils.models import Image
from user_auth.models.employee import EmployeeProfile

class WorkExperience(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='work_experiences')
    title = models.CharField(max_length=100)
    work_type = models.TextField()
    company_or_event = models.CharField(max_length=100)
    start_date = models.DateField(null=False, blank=False) 
    end_date = models.DateField(null=True, blank=True) 
    description = models.TextField(blank=True, null=True)
    image = models.OneToOneField(Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='work_experience_image')
