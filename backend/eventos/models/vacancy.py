from django.db import models
from eventos.models.event import Event
from eventos.models.job_types import JobType
from eventos.models.vacancy_state import VacancyState


class Vacancy(models.Model):
    state = models.ForeignKey(VacancyState, on_delete=models.CASCADE, related_name='vacancies')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='vacancies')
    job_type = models.ForeignKey(JobType, on_delete=models.CASCADE, related_name='vacancies')

    def __str__(self):
        return self.name
