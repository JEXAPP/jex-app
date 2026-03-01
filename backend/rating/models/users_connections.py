from django.db import models
from user_auth.models import CustomUser

class UserConnection(models.Model):
    employee = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="employer_relations"
    )
    employer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="employee_relations"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'employer')
        ordering = ['-created_at']

    def __str__(self):
        return f"Employee {self.employee.email} linked to Employer {self.employer.email}"