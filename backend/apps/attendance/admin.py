from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'check_in', 'facial_recognition_match', 'confidence_score')
    list_filter = ('facial_recognition_match',)
    search_fields = ('user__email',)
