from django.db import models
from user_auth.models import CustomUser  # Importa el modelo de usuario
from rating.models.behavior import Behavior
from rating.models.state_penalty import StatePenalty  # Asegúrate de usar el nombre correcto

class Penalty(models.Model):
    behavior = models.ForeignKey(Behavior, on_delete=models.CASCADE, related_name="penalties")
    punisher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="given_penalties")
    penalty_type = models.ForeignKey(StatePenalty, on_delete=models.CASCADE, related_name="penalty_types")
    comments = models.TextField(blank=True)
    penalty_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_penalties"
        ordering = ['-penalty_date']

    def __str__(self):
        return f"Penalty for {self.behavior.user.email} by {self.punisher.email} ({self.penalty_type.name})"
    