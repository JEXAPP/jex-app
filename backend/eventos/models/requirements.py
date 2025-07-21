from django.db import models

from eventos.models.vacancy import Vacancy


class Requirements(models.Model):
    description = models.TextField(null=False, blank=False)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, related_name='requirements')

    def __str__(self):
        return self.description
