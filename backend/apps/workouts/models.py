from django.db import models
from django.conf import settings

class WorkoutPlan(models.Model):
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_plans')
    title = models.CharField(max_length=255, default='Push Hypertrophy Routine')
    description = models.TextField(blank=True, null=True, default='Chest, Shoulders & Triceps progressive overload routine')
    difficulty = models.CharField(max_length=50, default='Intermediate')
    ai_generated = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_workout_plan'

    def __str__(self):
        return f"{self.title} for {self.member.email}"

class Exercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=255)
    sets_reps = models.CharField(max_length=50, default='4 x 10-12')
    target_load = models.CharField(max_length=50, default='24 kg')
    status = models.CharField(max_length=20, default='Pending') # Completed / Pending
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tbl_exercise'

    def __str__(self):
        return f"{self.name} ({self.sets_reps} @ {self.target_load}) - {self.status}"

