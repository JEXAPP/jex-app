from django.db import models

from applications.models.offers import Offer
from payments.models.payment_state import PaymentState
from user_auth.models.user import CustomUser

class Payment(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2)
    concept = models.CharField(max_length=255)
    mp_payment_id = models.CharField(max_length=100, null=True, blank=True)
    state = models.ForeignKey(PaymentState, on_delete=models.CASCADE, related_name='payments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)