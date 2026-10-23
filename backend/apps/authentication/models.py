from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.TextChoices):
    MEMBER = 'member', 'Member'
    TRAINER = 'trainer', 'Trainer'
    ADMIN = 'admin', 'Admin'

class Status(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    PENDING = 'Pending Approval', 'Pending Approval'
    PENDING_ALT = 'Pending', 'Pending'
    INACTIVE = 'Inactive', 'Inactive'
    SUSPENDED = 'Suspended', 'Suspended'

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(unique=True, help_text="Primary authentication email")
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
        help_text="Role determining dashboard access"
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    class Meta:
        db_table = 'tbl_users'

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        if self.status == Status.INACTIVE or self.status == Status.SUSPENDED:
            self.is_active = False
        else:
            self.is_active = True
        super().save(*args, **kwargs)

    @property
    def name(self):
        return self.full_name or self.email

    @property
    def phone_no(self):
        return self.phone

    def __str__(self):
        return f"{self.email} ({self.role})"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, default='AI Alert')
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_notification'
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"


class Appointment(models.Model):
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='member_appointments')
    trainer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='trainer_appointments')
    title = models.CharField(max_length=255, default='1-on-1 Personal Training Session')
    scheduled_time = models.DateTimeField()
    status = models.CharField(max_length=50, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_appointment'
        ordering = ['-scheduled_time']

    def __str__(self):
        return f"Appointment: {self.title} with {self.member.email}"

