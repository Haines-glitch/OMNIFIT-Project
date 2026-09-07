from django.contrib import admin
from .models import Member

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'assigned_trainer', 'membership_plan', 'fitness_goal', 'is_active', 'created_at')
    list_filter = ('membership_plan', 'is_active')
    search_fields = ('user__email', 'user__full_name', 'fitness_goal')
