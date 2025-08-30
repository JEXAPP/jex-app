from django.utils import timezone
from django.db import models

from user_auth.models.employee import EmployeeProfile
from vacancies.models.shifts import Shift


class Attendance(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name="attendances")
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name="attendances")
    
    check_in = models.DateTimeField(default=timezone.now) 
    
    verified_by = models.ForeignKey(
        "user_auth.EmployerProfile",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_attendances"
    )
    
    class Meta:
        db_table = "applications_attendance"
        unique_together = ("employee", "shift")
    def __str__(self):
        return f"{self.employee.user.email} - {self.shift.id} ({self.check_in})"