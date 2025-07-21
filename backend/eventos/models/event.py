from django.db import models
from eventos.models.category_events import Category
from eventos.models.state_events import EventState
from user_auth.models.user import CustomUser


class Event(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField(max_length=500, null=False, blank=False)

    start_date = models.DateField(null=False, blank=False) 
    end_date = models.DateField(null=False, blank=False)    
    start_time = models.TimeField(null=False, blank=False)  
    end_time = models.TimeField(null=False, blank=False)    

    location = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    state = models.ForeignKey(EventState, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return self.name

