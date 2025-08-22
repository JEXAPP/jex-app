from django.db import models
from django.utils import timezone
from django.conf import settings
from applications.models.applications import Application
from vacancies.models.shifts import Shift
from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile

class Offer(models.Model):
    # 🔑 Identificadores y relaciones
    application = models.ForeignKey(Application, null=True, blank=True, on_delete=models.SET_NULL, related_name='offers')
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='offers')
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE, related_name='offers')
    selected_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, null=True, blank=True, related_name='selected_offers')

    # 📅 Vencimiento y metadatos
    expiration_date = models.DateField(null=True, blank=True)
    expiration_time = models.TimeField(null=True, blank=True)
    expiration_datetime = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # 💬 Comentarios
    additional_comments = models.TextField(blank=True)

    # ✅ Confirmación
    confirmed_at = models.DateTimeField(null=True, blank=True)
    confirmed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    # 📋 Detalles del turno
    job_type = models.CharField(max_length=100, null=True, blank=True)
    shift_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requeriments = models.TextField(max_length=255, null=True, blank=True)

    # ❌ Rechazo y estado
    rejection_reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'applications_offers'
        ordering = ['-created_at']

    def __str__(self):
        return f"Offer to {self.employee.user.email} - Application: {self.application.id if self.application else 'Direct Offer'}"

