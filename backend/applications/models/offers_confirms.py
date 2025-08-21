from django.db import models
from django.conf import settings  # para usar AUTH_USER_MODEL

class OfferConfirmation(models.Model):
    offer = models.ForeignKey('applications.Offer', on_delete=models.CASCADE, related_name='confirmations')
    confirmed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    confirmed_at = models.DateTimeField(auto_now_add=True)

    job_type = models.CharField(max_length=100)
    fecha_turno = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    empresa = models.CharField(max_length=255)
    vencimiento = models.DateTimeField()
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    additional_comments = models.TextField(blank=True)
    requirements = models.ManyToManyField('vacancies.Requirements', blank=True)
    rejected = models.BooleanField(default=False)

    def __str__(self):
        return f"Confirmación de oferta #{self.offer.id} por {self.confirmed_by}"