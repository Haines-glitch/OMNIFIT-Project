from django.db import models
from django.conf import settings

class Trainer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trainer_profile')
    specialization = models.CharField(max_length=255, default='AI Resistance & Hypertrophy')
    years_experience = models.IntegerField(default=5)
    bio = models.TextField(blank=True, null=True)
    certification = models.CharField(max_length=255, default='NASM Certified Master Trainer')

    def __str__(self):
        return f"Trainer: {self.user.email}"
