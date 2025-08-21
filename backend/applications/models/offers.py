from django.db import models
from django.utils import timezone
from applications.models.applications import Application
from vacancies.models.shifts import Shift
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile


class Offer(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile,
        on_delete=models.CASCADE,
        related_name='offers'
    )
    application = models.ForeignKey(
        Application,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='offers'
    )
    employer = models.ForeignKey(
        EmployerProfile,
        on_delete=models.CASCADE,
        related_name='offers'
    )
    shifts = models.ManyToManyField(
    Shift,
    blank=True,
    related_name='offers'
    )
    selected_shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='selected_offers'
    )
    expiration_date = models.DateField(
        null=True,
        blank=True,
        help_text="Fecha límite para aceptar la oferta"
    )

    additional_comments = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Offer to {self.employee.user.email} - Application: {self.application.id if self.application else 'Direct Offer'}"
