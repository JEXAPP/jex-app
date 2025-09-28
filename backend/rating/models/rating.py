from django.db import models
from user_auth.models import CustomUser  # Importa el modelo de usuario
from rating.models.behavior import Behavior

class Rating(models.Model):
    behavior = models.ForeignKey(Behavior, on_delete=models.CASCADE, related_name="ratings")
    rater = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="given_ratings")
    rating = models.FloatField()
    comments = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_ratings"
        ordering = ['-date']

    def __str__(self):
        return f"Rating {self.rating} for {self.behavior.user.email} by {self.rater.email}"