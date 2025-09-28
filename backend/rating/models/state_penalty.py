from django.db import models

class StatePenalty(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "penalty_states"

    def __str__(self):
        return self.name