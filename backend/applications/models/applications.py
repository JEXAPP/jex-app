from django.db import models
from django.utils import timezone

from applications.models.applications_states import ApplicationState
from vacancies.models.shifts import Shift
from user_auth.models.employee import EmployeeProfile


class Application(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile, 
        on_delete=models.CASCADE,
        related_name='applications'
    )
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    state = models.ForeignKey(ApplicationState, on_delete=models.CASCADE, related_name='applications')

    message = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('employee', 'shift')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.employee.user.email} - {self.shift} - {self.status}"