from django.db import models

# Create your models here.

class Evento(models.Model):
    nombre = models.CharField(max_length=100, null=False, blank=False)

    def __str__(self):
        return self.nombre