from django.contrib import admin
from .models import WorkoutPlan

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'member', 'difficulty', 'ai_generated', 'created_at')
    list_filter = ('difficulty', 'ai_generated')
    search_fields = ('title', 'member__email')
