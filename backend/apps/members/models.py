from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import date, timedelta

class Member(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='member_profile')
    assigned_trainer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='clients')
    membership_no = models.CharField(max_length=50, unique=True, blank=True, null=True)
    join_date = models.DateField(default=date.today)
    membership_plan = models.CharField(max_length=100, default='Platinum VIP')
    expiry_date = models.DateField(null=True, blank=True)
    height_cm = models.FloatField(null=True, blank=True, default=180.0)
    weight_kg = models.FloatField(null=True, blank=True, default=78.5)
    bmi = models.FloatField(null=True, blank=True, default=23.7)
    fitness_goal = models.CharField(max_length=255, default='Hypertrophy & Fat Loss')
    status = models.CharField(max_length=20, default='Active')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'tbl_member'

    def save(self, *args, **kwargs):
        if not self.membership_no and self.user_id:
            self.membership_no = f"OMNI-MBR-{1000 + self.user_id}"
        if not self.expiry_date:
            self.expiry_date = date.today() + timedelta(days=120)
        if self.height_cm and self.weight_kg:
            height_m = self.height_cm / 100.0
            if height_m > 0:
                self.bmi = round(self.weight_kg / (height_m ** 2), 1)
        super().save(*args, **kwargs)

    @property
    def membership_type(self):
        return self.membership_plan

    @property
    def height(self):
        return self.height_cm

    @property
    def weight(self):
        return self.weight_kg

    @property
    def goal(self):
        return self.fitness_goal

    def __str__(self):
        return f"Member: {self.user.email} ({self.membership_no})"

