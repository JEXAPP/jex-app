from django.db import models

from media_utils.models import Image
from user_auth.models.employee import EmployeeProfile

class EducationCertification(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='educations')
    institution = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    discipline = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField(null=False, blank=False) 
    end_date =  models.DateField(null=True, blank=True) 
    description = models.TextField(blank=True, null=True)
    image = models.OneToOneField(Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='education_image')
