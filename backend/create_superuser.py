import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'omnifit_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.adminpanel.models import AdminProfile

User = get_user_model()

email = os.environ.get('SUPERUSER_EMAIL', '').strip()
password = os.environ.get('SUPERUSER_PASSWORD', '').strip()
name = os.environ.get('SUPERUSER_NAME', 'Omnifit Super Admin').strip()
phone = os.environ.get('SUPERUSER_PHONE', '+1 (555) 999-0000').strip()

if email and password:
    try:
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'full_name': name,
                'phone': phone,
                'role': 'admin',
                'status': 'Active',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        user.set_password(password)
        user.role = 'admin'
        user.status = 'Active'
        user.is_staff = True
        user.is_superuser = True
        user.full_name = name
        user.save()

        AdminProfile.objects.get_or_create(user=user, defaults={'access_level': 'SuperAdmin'})
        action = "Created" if created else "Updated"
        print(f"[OMNIFIT] Super Admin user '{email}' successfully {action}!")
    except Exception as e:
        print(f"[OMNIFIT] Error creating superuser: {e}")
else:
    print("[OMNIFIT] SUPERUSER_EMAIL or SUPERUSER_PASSWORD not set. Skipping superuser creation.")

# Optional seed demo data trigger
if os.environ.get('SEED_DATABASE', 'False').lower() in ('true', '1'):
    try:
        print("[OMNIFIT] SEED_DATABASE is True. Seeding demo data...")
        import seed_data
    except Exception as e:
        print(f"[OMNIFIT] Error running seed_data: {e}")
