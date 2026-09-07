import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.members.models import Member
from apps.trainers.models import Trainer
from apps.workouts.models import WorkoutPlan
from apps.diet.models import DietPlan
from apps.attendance.models import Attendance
from apps.payments.models import Payment

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds database with latest comprehensive initial data for OMNIFIT Ecosystem'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Seeding OMNIFIT Ecosystem database...'))

        # 1. Create Superuser / Admin
        admin_user, created = User.objects.get_or_create(
            email='admin@omnifit.com',
            defaults={
                'username': 'admin@omnifit.com',
                'full_name': 'System Administrator',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created Admin: admin@omnifit.com / admin123'))

        # 2. Create Trainers
        trainers_data = [
            {'email': 'marcus.vance@omnifit.com', 'name': 'Marcus Vance', 'spec': 'NASM Master Trainer - Hypertrophy', 'exp': 8},
            {'email': 'elena.rostova@omnifit.com', 'name': 'Elena Rostova', 'spec': 'AI Bio-Metrics & Pilates Master', 'exp': 6},
            {'email': 'david.kim@omnifit.com', 'name': 'David Kim', 'spec': 'Functional Strength & Conditioning', 'exp': 10},
        ]

        trainers_list = []
        for t_info in trainers_data:
            user, u_created = User.objects.get_or_create(
                email=t_info['email'],
                defaults={
                    'username': t_info['email'],
                    'full_name': t_info['name'],
                    'role': 'trainer',
                    'is_staff': True
                }
            )
            if u_created:
                user.set_password('trainer123')
                user.save()

            trainer_profile, _ = Trainer.objects.get_or_create(
                user=user,
                defaults={
                    'specialization': t_info['spec'],
                    'years_experience': t_info['exp'],
                    'certification': 'NASM Master Certified',
                    'bio': f"Expert in {t_info['spec']} with over {t_info['exp']} years of performance coaching."
                }
            )
            trainers_list.append(user)

        # 3. Create Members
        members_data = [
            {'email': 'abhilash.kk@omnifit.com', 'name': 'Abhilash KK', 'plan': 'Platinum VIP', 'goal': 'Hypertrophy & Performance', 'weight': 76.0, 'height': 178.0},
            {'email': 'alex.mercer@omnifit.com', 'name': 'Alex Mercer', 'plan': 'Platinum VIP', 'goal': 'Hypertrophy & Fat Loss', 'weight': 78.5, 'height': 180.0},
            {'email': 'sarah.jenkins@omnifit.com', 'name': 'Sarah Jenkins', 'plan': 'Gold Fitness', 'goal': 'Endurance & Cardio', 'weight': 62.0, 'height': 168.0},
            {'email': 'michael.scott@omnifit.com', 'name': 'Michael Scott', 'plan': 'Silver Basic', 'goal': 'Weight Management', 'weight': 85.0, 'height': 175.0},
            {'email': 'rachel.green@omnifit.com', 'name': 'Rachel Green', 'plan': 'Platinum VIP', 'goal': 'Flexibility & Toning', 'weight': 56.5, 'height': 165.0},
        ]

        for idx, m_info in enumerate(members_data):
            user, u_created = User.objects.get_or_create(
                email=m_info['email'],
                defaults={
                    'username': m_info['email'],
                    'full_name': m_info['name'],
                    'role': 'member'
                }
            )
            if u_created:
                user.set_password('member123')
                user.save()

            assigned_trainer = trainers_list[idx % len(trainers_list)]
            member_profile, _ = Member.objects.get_or_create(
                user=user,
                defaults={
                    'assigned_trainer': assigned_trainer,
                    'height_cm': m_info['height'],
                    'weight_kg': m_info['weight'],
                    'bmi': round(m_info['weight'] / ((m_info['height'] / 100) ** 2), 1),
                    'fitness_goal': m_info['goal'],
                    'membership_plan': m_info['plan'],
                    'is_active': True
                }
            )

            # Create Workouts & Diets for each member
            WorkoutPlan.objects.get_or_create(
                member=user,
                title="AI Hypertrophy Split",
                defaults={
                    'description': "4 Sets Incline Bench Press, Dumbbell Flyes, Cable Crossovers",
                    'difficulty': "Advanced",
                    'ai_generated': True
                }
            )

            DietPlan.objects.get_or_create(
                member=user,
                title="High-Protein Caloric Surplus",
                defaults={
                    'daily_calories': 2500,
                    'protein_grams': 180,
                    'carbs_grams': 250,
                    'fats_grams': 65,
                    'ai_customized': True
                }
            )

            # Attendance records
            for d in range(5):
                Attendance.objects.create(
                    user=user,
                    check_in=datetime.now() - timedelta(days=d, hours=random.randint(1, 4)),
                    facial_recognition_match=True,
                    confidence_score=round(random.uniform(98.5, 99.9), 1)
                )

            # Payment records
            Payment.objects.get_or_create(
                transaction_id=f"TXN-984{idx + 1}",
                defaults={
                    'user': user,
                    'amount': 199.00 if m_info['plan'] == 'Platinum VIP' else (129.00 if m_info['plan'] == 'Gold Fitness' else 89.00),
                    'status': 'Paid' if idx != 2 else 'Pending'
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with latest users, members, trainers, workouts, diets, attendance & payments!'))
