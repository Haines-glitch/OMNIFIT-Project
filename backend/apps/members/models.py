from django.db import models
from django.conf import settings

class Member(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='member_profile')
    assigned_trainer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='clients')
    height_cm = models.FloatField(null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)
    bmi = models.FloatField(null=True, blank=True)
    fitness_goal = models.CharField(max_length=255, default='General Fitness & Fat Loss')
    membership_plan = models.CharField(max_length=100, default='Platinum VIP')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Member: {self.user.email}"
