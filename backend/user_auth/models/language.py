
from django.db import models
from user_auth.models.employee import EmployeeProfile


class LanguageLevel(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class EmployeeLanguage(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile,
        on_delete=models.CASCADE,
        related_name='languages'
    )
    language = models.CharField(max_length=50)
    level = models.ForeignKey(
        LanguageLevel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employee_languages'
    )
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee.user.email} - {self.language} ({self.level})"
