from django.db import models

class ApplicationState(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)

    