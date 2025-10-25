from django.db import models

from rating.models.penalty_category import PenaltyCategory


class PenaltyType(models.Model):
    category = models.ForeignKey(PenaltyCategory, on_delete=models.CASCADE, related_name="types")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.category.name} - {self.name}"