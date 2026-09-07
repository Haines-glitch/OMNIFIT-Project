from django.contrib import admin
from .models import Trainer

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'certification', 'years_experience')
    search_fields = ('user__email', 'user__full_name', 'specialization')
