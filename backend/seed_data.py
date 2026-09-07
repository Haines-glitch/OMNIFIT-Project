import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'omnifit_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.members.models import Member
from apps.trainers.models import Trainer
from apps.adminpanel.models import AdminProfile
from apps.workouts.models import WorkoutPlan, Exercise
from apps.attendance.models import Attendance
from apps.payments.models import Payment
from apps.authentication.models import Notification, Appointment

User = get_user_model()

print("Seeding OMNIFIT Ecosystem Data...")

# 1. Create Trainer
trainer_user, _ = User.objects.get_or_create(
    email='marcus.vance@omnifit.com',
    defaults={
        'username': 'marcus.vance@omnifit.com',
        'full_name': 'Marcus Vance',
        'role': 'trainer',
        'phone': '+1 (555) 234-5678',
        'status': 'Active'
    }
)
if not trainer_user.check_password('Trainer@123'):
    trainer_user.set_password('Trainer@123')
    trainer_user.save()

trainer_profile, _ = Trainer.objects.get_or_create(
    user=trainer_user,
    defaults={
        'specialization': 'Hypertrophy & Biomechanics',
        'years_experience': 8,
        'rating': 4.95,
        'bio': 'NASM Master Trainer specializing in high-performance hypertrophy and athletic rehab.',
        'status': 'Active'
    }
)

# 2. Create Member (Sarah Jenkins)
member_user, _ = User.objects.get_or_create(
    email='sarah.jenkins@omnifit.com',
    defaults={
        'username': 'sarah.jenkins@omnifit.com',
        'full_name': 'Sarah Jenkins',
        'role': 'member',
        'phone': '+1 (555) 019-2834',
        'status': 'Active'
    }
)
if not member_user.check_password('Member@123'):
    member_user.set_password('Member@123')
    member_user.save()

member_profile, _ = Member.objects.get_or_create(
    user=member_user,
    defaults={
        'assigned_trainer': trainer_user,
        'membership_plan': 'Platinum VIP',
        'height_cm': 168.0,
        'weight_kg': 68.5,
        'fitness_goal': 'Hypertrophy & Fat Loss',
        'status': 'Active'
    }
)

# 3. Create Admin
admin_user, _ = User.objects.get_or_create(
    email='admin@omnifit.com',
    defaults={
        'username': 'admin@omnifit.com',
        'full_name': 'Omnifit Executive Admin',
        'role': 'admin',
        'phone': '+1 (555) 999-0000',
        'status': 'Active'
    }
)
if not admin_user.check_password('Admin@123'):
    admin_user.set_password('Admin@123')
    admin_user.save()

AdminProfile.objects.get_or_create(user=admin_user, defaults={'access_level': 'Superadmin'})

# 4. Create Workout Plan & Exercises for Sarah Jenkins
plan, _ = WorkoutPlan.objects.get_or_create(
    member=member_user,
    title="Push Hypertrophy & Upper Body Focus",
    defaults={
        'description': 'Targeted chest, shoulders, and triceps program.',
        'ai_generated': True,
        'status': 'Active'
    }
)

Exercise.objects.get_or_create(
    workout_plan=plan,
    name="Incline Dumbbell Press",
    defaults={'sets_reps': '4 x 10–12', 'target_load': '24 kg', 'status': 'Completed'}
)
Exercise.objects.get_or_create(
    workout_plan=plan,
    name="Barbell Overhead Press",
    defaults={'sets_reps': '3 x 8–10', 'target_load': '40 kg', 'status': 'Pending'}
)
Exercise.objects.get_or_create(
    workout_plan=plan,
    name="Cable Lateral Raises",
    defaults={'sets_reps': '4 x 15', 'target_load': '10 kg', 'status': 'Pending'}
)

# 5. Create Sample Notifications
Notification.objects.get_or_create(
    user=member_user,
    title="Macro Target Adjusted",
    defaults={
        'notification_type': 'AI Alert',
        'message': 'Protein target increased to 160g based on recent intensity logs.',
        'read': False
    }
)
Notification.objects.get_or_create(
    user=member_user,
    title="1-on-1 Session Confirmed",
    defaults={
        'notification_type': 'Appointment',
        'message': 'Session scheduled with Marcus Vance at 10:00 AM.',
        'read': False
    }
)

# 6. Create Payments
Payment.objects.get_or_create(
    transaction_id="TXN-998214",
    defaults={
        'user': member_user,
        'amount': 299.00,
        'plan_name': 'Platinum VIP Membership',
        'status': 'COMPLETED'
    }
)

print("OMNIFIT Seed Data successfully populated!")
