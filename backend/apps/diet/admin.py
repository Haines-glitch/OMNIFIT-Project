from django.contrib import admin
from .models import DietPlan

@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'member', 'daily_calories', 'protein_grams', 'carbs_grams', 'fats_grams', 'ai_customized', 'created_at')
    list_filter = ('ai_customized',)
    search_fields = ('title', 'member__email')
