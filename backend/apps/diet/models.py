from django.db import models
from django.conf import settings

class DietPlan(models.Model):
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diet_plans')
    title = models.CharField(max_length=255, default='High-Protein Caloric Surplus')
    daily_calories = models.IntegerField(default=2500)
    protein_grams = models.IntegerField(default=180)
    carbs_grams = models.IntegerField(default=250)
    fats_grams = models.IntegerField(default=65)
    ai_customized = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diet ({self.daily_calories} kcal) for {self.member.email}"
