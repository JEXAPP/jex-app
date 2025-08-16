from django.db import models

# Create your models here.
from django.db import models



class ImageType(models.TextChoices):
    PROFILE = 'profile', 'Profile Image'
    EVENT = 'event', 'Event Image'
    OTHER = 'other', 'Other'

class Image(models.Model):
    url = models.URLField()
    public_id = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=10, choices=ImageType.choices)
    uploaded_by = models.ForeignKey('user_auth.CustomUser', on_delete=models.CASCADE, related_name='images')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} image by {self.uploaded_by.email}"