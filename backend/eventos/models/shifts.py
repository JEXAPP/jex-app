from django.db import models
from eventos.models.vacancy import Vacancy


class Shift(models.Model):
    start_time = models.TimeField(null=False, blank=False)
    end_time = models.TimeField(null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, related_name='shifts')
    payment = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    quantity = models.PositiveIntegerField(null=False, blank=False)

    def __str__(self):
        return f"{self.start_time} - {self.end_time} for {self.vacancy.name}"