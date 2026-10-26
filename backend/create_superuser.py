import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'omnifit_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.adminpanel.models import AdminProfile
from apps.trainers.models import Trainer

User = get_user_model()

# 1. Admin Credentials (Preserve / Set)
admin_email = os.environ.get('SUPERUSER_EMAIL', 'admin@omnifit.com').strip() or 'admin@omnifit.com'
admin_password = os.environ.get('SUPERUSER_PASSWORD', 'password').strip() or 'password'
admin_name = os.environ.get('SUPERUSER_NAME', 'Omnifit Super Admin').strip() or 'Omnifit Super Admin'
admin_phone = os.environ.get('SUPERUSER_PHONE', '+1 (555) 999-0000').strip()

try:
    admin_user, created = User.objects.get_or_create(
        email=admin_email,
        defaults={
            'username': admin_email,
            'full_name': admin_name,
            'phone': admin_phone,
            'role': 'admin',
            'status': 'Active',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
        }
    )
    admin_user.set_password(admin_password)
    admin_user.role = 'admin'
    admin_user.status = 'Active'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.full_name = admin_name
    admin_user.save()

    AdminProfile.objects.get_or_create(user=admin_user, defaults={'access_level': 'SuperAdmin'})
    action = "Created" if created else "Verified"
    print(f"[OMNIFIT] Super Admin user '{admin_email}' successfully {action}!")
except Exception as e:
    print(f"[OMNIFIT] Error ensuring superuser: {e}")

# 2. Trainer Credentials (Preserve / Set)
trainer_email = os.environ.get('TRAINER_EMAIL', 'trainer@omnifit.com').strip() or 'trainer@omnifit.com'
trainer_password = os.environ.get('TRAINER_PASSWORD', 'Trainer@123').strip() or 'Trainer@123'
trainer_name = os.environ.get('TRAINER_NAME', 'Marcus Vance').strip() or 'Marcus Vance'

try:
    trainer_user, created = User.objects.get_or_create(
        email=trainer_email,
        defaults={
            'username': trainer_email,
            'full_name': trainer_name,
            'phone': '+1 (555) 234-5678',
            'role': 'trainer',
            'status': 'Active',
            'is_staff': False,
            'is_superuser': False,
            'is_active': True,
        }
    )
    trainer_user.set_password(trainer_password)
    trainer_user.role = 'trainer'
    trainer_user.status = 'Active'
    trainer_user.is_active = True
    trainer_user.save()

    Trainer.objects.get_or_create(
        user=trainer_user,
        defaults={
            'specialization': 'Bodybuilding & Strength',
            'experience': 8,
            'qualification': 'B.Sc Exercise Physiology',
            'certification': 'CSCS & NASM CPT',
            'status': 'Active'
        }
    )
    action = "Created" if created else "Verified"
    print(f"[OMNIFIT] Trainer user '{trainer_email}' successfully {action}!")
except Exception as e:
    print(f"[OMNIFIT] Error ensuring trainer: {e}")

# Ensure marcus.vance@omnifit.com is also preserved with Trainer@123
try:
    mv = User.objects.filter(email='marcus.vance@omnifit.com').first()
    if mv:
        mv.set_password('Trainer@123')
        mv.role = 'trainer'
        mv.status = 'Active'
        mv.is_active = True
        mv.save()
        Trainer.objects.get_or_create(
            user=mv,
            defaults={
                'specialization': 'Hypertrophy & Biomechanics',
                'experience': 8,
                'status': 'Active'
            }
        )
except Exception as e:
    pass
