from django.db import models
from eventos.models.event import Event
from eventos.models.job_types import JobType
from eventos.models.vacancy_state import VacancyState


class Vacancy(models.Model):
    state = models.ForeignKey(VacancyState, on_delete=models.CASCADE, related_name='vacancies')
    description = models.TextField(max_length=400, null=False, blank=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='vacancies')
    job_type = models.ForeignKey(JobType, on_delete=models.CASCADE, related_name='vacancies')
    specific_job_type = models.CharField(max_length=255, null=True, blank=True)


