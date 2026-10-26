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

# 2. Ensure Anandhu pradeep trainer is active
try:
    anandhu = User.objects.filter(role='trainer').filter(email__icontains='anandhu').first()
    if not anandhu:
        anandhu = User.objects.filter(email='anandhu@omnifit.com').first()
    if anandhu:
        anandhu.role = 'trainer'
        anandhu.status = 'Active'
        anandhu.is_active = True
        anandhu.save()
        Trainer.objects.get_or_create(
            user=anandhu,
            defaults={
                'specialization': 'Cardio',
                'experience': 5,
                'working_days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'start_time': '08:00 AM',
                'end_time': '05:00 PM',
                'status': 'Active'
            }
        )
        print(f"[OMNIFIT] Verified trainer '{anandhu.email}' ({anandhu.full_name})!")
except Exception as e:
    print(f"[OMNIFIT] Error checking trainer: {e}")
