from django.db import models
from django.conf import settings

class Trainer(models.Model):
    SPECIALIZATION_CHOICES = [
        ('Weight Loss', 'Weight Loss'),
        ('Strength Training', 'Strength Training'),
        ('Bodybuilding', 'Bodybuilding'),
        ('Cardio', 'Cardio'),
        ('Yoga', 'Yoga'),
        ('CrossFit', 'CrossFit'),
        ('Functional Training', 'Functional Training'),
        ('General Fitness', 'General Fitness'),
        ('Nutrition', 'Nutrition'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trainer_profile'
    )
    specialization = models.CharField(max_length=255, choices=SPECIALIZATION_CHOICES, default='Strength Training')
    experience = models.IntegerField(default=5, help_text="Years of professional experience")
    qualification = models.CharField(max_length=255, blank=True, null=True, default='B.Sc Sports Science')
    certification = models.CharField(max_length=255, blank=True, null=True, default='NASM Master Certified')
    license_number = models.CharField(max_length=100, blank=True, null=True, default='NASM-98421')
    experience_certificate = models.FileField(upload_to='trainer_certificates/', blank=True, null=True, help_text="PDF document verifying trainer's work experience")
    bio = models.TextField(blank=True, null=True, default='Certified Master Trainer specializing in biomechanics, strength conditioning, and personalized endurance programs.')
    
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True, default='Male')
    
    working_days = models.JSONField(default=list, blank=True, help_text="List of available working days")
    start_time = models.CharField(max_length=20, default='08:00 AM')
    end_time = models.CharField(max_length=20, default='05:00 PM')
    
    rating = models.FloatField(default=4.95)
    status = models.CharField(max_length=20, default='Active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tbl_trainer'

    @property
    def experience_years(self):
        return self.experience

    @property
    def years_experience(self):
        return self.experience

    def __str__(self):
        return f"Trainer: {self.user.full_name or self.user.email} ({self.specialization})"
