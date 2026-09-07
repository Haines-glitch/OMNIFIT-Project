from django.db import models
from django.conf import settings

class Attendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendances')
    check_in = models.DateTimeField(auto_now_add=True)
    facial_recognition_match = models.BooleanField(default=True)
    confidence_score = models.FloatField(default=99.8)
    status = models.CharField(max_length=20, default='Present')

    class Meta:
        db_table = 'tbl_attendance'
        ordering = ['-check_in']

    def __str__(self):
        return f"Attendance {self.user.email} at {self.check_in}"

