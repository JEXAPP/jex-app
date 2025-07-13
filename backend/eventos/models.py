from django.db import models

from user_auth.models import CustomUser


class Event(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    start_date = models.DateField(null=False, blank=False) 
    end_date = models.DateField(null=False, blank=False)    

    start_time = models.TimeField(null=False, blank=False)  
    end_time = models.TimeField(null=False, blank=False)    
    
    location = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    employer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.name
