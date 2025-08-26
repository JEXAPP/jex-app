from django.db import models
from django.utils import timezone
from django.conf import settings
from applications.models.applications import Application
from applications.models.offer_state import OfferState
from vacancies.models.shifts import Shift
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from django.contrib.postgres.fields import ArrayField


class Offer(models.Model):
    application = models.ForeignKey(Application, null=True, blank=True, on_delete=models.SET_NULL, related_name='offers')
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='offers')
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='offers')
    selected_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, null=True, blank=True, related_name='selected_offers')

    expiration_date = models.DateField(null=True, blank=True)
    expiration_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    additional_comments = models.TextField(blank=True)

    confirmed_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(null=True, blank=True)
    state = models.ForeignKey(OfferState, on_delete=models.CASCADE, related_name='offer')

    class Meta:
        db_table = 'applications_offers'
        ordering = ['-created_at']

    def __str__(self):
        return f"Offer to {self.employee.user.email} - Application: {self.application.id if self.application else 'Direct Offer'}"

