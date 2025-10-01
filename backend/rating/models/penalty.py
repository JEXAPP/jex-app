from django.db import models
from user_auth.models import CustomUser
from rating.models.behavior import Behavior
from rating.models.state_penalty import StatePenalty
from eventos.models.event import Event

class Penalty(models.Model):
    behavior = models.ForeignKey(Behavior, on_delete=models.CASCADE, related_name="penalties")
    punisher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="given_penalties")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="penalties")
    comments = models.TextField(blank=True)
    penalty_state = models.ForeignKey(StatePenalty, on_delete=models.CASCADE, related_name="penalty_states")
    penalty_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-penalty_date']

    def __str__(self):
        return f"Penalty for {self.behavior.user.email} by {self.punisher.email} ({self.penalty_state.name})"
    