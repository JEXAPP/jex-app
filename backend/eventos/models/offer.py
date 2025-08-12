from django.db import models
from eventos.models.vacancy import Vacancy


class Offer(models.Model):
    description = models.TextField(null=False, blank=False)

    def __str__(self):
        return f"{self.start_time} - {self.end_time} for {self.vacancy.name}"