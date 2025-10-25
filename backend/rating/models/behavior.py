from django.db import models
from django.db.models import Avg
from user_auth.models import CustomUser  # Importa tu modelo de usuario

class Behavior(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="behaviors")
    average_rating = models.FloatField(default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Behavior of {self.user.email}"

    def update_average_rating(self):
        avg = self.ratings.aggregate(Avg('rating'))['rating__avg'] or 0
        self.average_rating = avg
        self.save()