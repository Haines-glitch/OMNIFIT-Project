from django.db import migrations
from django.contrib.auth.hashers import make_password

def keep_only_anandhu_trainer(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Trainer = apps.get_model('trainers', 'Trainer')

    # Look for anandhu trainer user (case-insensitive)
    anandhu = User.objects.filter(role='trainer').filter(
        email__icontains='anandhu'
    ).first()

    if not anandhu:
        # Check if user exists with anandhu email
        anandhu = User.objects.filter(email__icontains='anandhu').first()
        if anandhu:
            anandhu.role = 'trainer'
            anandhu.status = 'Active'
            anandhu.is_active = True
            anandhu.save()
        else:
            anandhu = User.objects.create(
                email='anandhu@omnifit.com',
                username='anandhu@omnifit.com',
                full_name='Anandhu pradeep',
                phone='+1 (555) 234-5678',
                role='trainer',
                status='Active',
                is_active=True,
                password=make_password('Trainer@123')
            )

    # Ensure Anandhu has a Trainer profile
    Trainer.objects.get_or_create(
        user=anandhu,
        defaults={
            'specialization': 'Cardio',
            'experience': 5,
            'qualification': 'MCA',
            'certification': 'NASM Master Certified',
            'working_days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'start_time': '08:00 AM',
            'end_time': '05:00 PM',
            'status': 'Active'
        }
    )

    # Delete all other trainers except Anandhu pradeep
    other_trainers = User.objects.filter(role='trainer').exclude(id=anandhu.id)
    other_ids = list(other_trainers.values_list('id', flat=True))

    Trainer.objects.filter(user_id__in=other_ids).delete()
    deleted_count, _ = other_trainers.delete()

    print(f"[OMNIFIT] Removed {deleted_count} trainer(s). Kept only Anandhu pradeep ({anandhu.email}).")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0003_remove_all_members'),
        ('trainers', '0004_trainer_experience_certificate'),
    ]

    operations = [
        migrations.RunPython(keep_only_anandhu_trainer, reverse_code=migrations.RunPython.noop),
    ]
