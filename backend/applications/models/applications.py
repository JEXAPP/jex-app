from django.db import models
from django.utils import timezone

from vacancies.models.shifts import Shift
from user_auth.models.employee import EmployeeProfile
from applications.constants import ApplicationStates


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
    status = models.CharField(
        max_length=20,
        choices=[(state.value, state.value) for state in ApplicationStates],
        default=ApplicationStates.PENDING.value
    )
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('employee', 'shift')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.employee.user.email} - {self.shift} - {self.status}"