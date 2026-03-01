from django.db import models

from rating.models.penalty import Penalty
from rating.models.state_penalty import StatePenalty
from user_auth.models.user import CustomUser

class PenaltyStateHistory(models.Model):
    penalty = models.ForeignKey(
        Penalty,
        on_delete=models.CASCADE,
        related_name="state_history"
    )

    state = models.ForeignKey(
        StatePenalty,
        on_delete=models.CASCADE,
        related_name="history_entries"
    )

    changed_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="penalty_state_changes"
    )

    comment = models.TextField(blank=True)

    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-changed_at']