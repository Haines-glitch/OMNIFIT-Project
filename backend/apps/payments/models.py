from django.db import models
from django.conf import settings

class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default='COMPLETED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment ${self.amount} - {self.transaction_id}"
