from django.db import models
from django.conf import settings

class AdminProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_profile')
    access_level = models.CharField(max_length=50, default='SuperAdmin')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_admin'

    def __str__(self):
        return f"Admin: {self.user.email} ({self.access_level})"

class SystemNotification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_global = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

