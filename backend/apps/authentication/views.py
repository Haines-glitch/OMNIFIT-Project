from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta

from .serializers import (
    CustomTokenObtainPairSerializer, 
    RegisterSerializer, 
    UserSerializer, 
    ChangePasswordSerializer,
    DEFAULT_AVATAR
)

from apps.members.models import Member
from apps.trainers.models import Trainer
from apps.adminpanel.models import AdminProfile
from apps.workouts.models import WorkoutPlan, Exercise
from apps.attendance.models import Attendance
from apps.payments.models import Payment
from .models import Notification, Appointment

User = get_user_model()

def standard_response(success=True, message="", data=None, errors=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": success,
        "message": message,
        "data": data,
        "errors": errors
    }, status=status_code)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            token_data = serializer.validated_data
            return standard_response(
                success=True,
                message="Login successful.",
                data=token_data,
                status_code=status.HTTP_200_OK
            )
        except Exception as exc:
            error_details = getattr(exc, 'detail', str(exc))
            # Check for 403 Forbidden suspension/inactive case
            if "suspended or inactive" in str(error_details):
                return standard_response(
                    success=False,
                    message="Account is inactive or suspended.",
                    data=None,
                    errors=error_details,
                    status_code=status.HTTP_403_FORBIDDEN
                )
            return standard_response(
                success=False,
                message="Authentication failed.",
                data=None,
                errors=error_details,
                status_code=status.HTTP_400_BAD_REQUEST
            )


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        # Force role to MEMBER regardless of request body
        data = request.data.copy()
        data['role'] = 'member'

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            errors = serializer.errors
            err_msg = "Registration validation failed."
            if "email" in errors:
                err_msg = errors["email"][0]
            elif "password" in errors:
                err_msg = errors["password"][0]
            return Response({
                "message": err_msg,
                "errors": errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        user.role = 'member'
        user.save()

        # Create/Update Member profile with extended details if supplied
        member, _ = Member.objects.get_or_create(user=user)
        if 'date_of_birth' in request.data:
            member.date_of_birth = request.data.get('date_of_birth')
        if 'gender' in request.data:
            member.gender = request.data.get('gender')
        if 'age' in request.data and request.data.get('age'):
            try:
                parsed_age = int(request.data.get('age'))
                if 10 <= parsed_age <= 120:
                    member.age = parsed_age
            except (ValueError, TypeError):
                pass
        if 'height' in request.data and request.data.get('height'):
            try:
                parsed_h = float(str(request.data.get('height')).replace('cm', '').strip())
                if 50.0 <= parsed_h <= 260.0:
                    member.height_cm = parsed_h
            except (ValueError, TypeError):
                pass
        if 'weight' in request.data and request.data.get('weight'):
            try:
                parsed_w = float(str(request.data.get('weight')).replace('kg', '').strip())
                if 20.0 <= parsed_w <= 350.0:
                    member.weight_kg = parsed_w
            except (ValueError, TypeError):
                pass
        if 'fitness_goal' in request.data or 'fitnessGoal' in request.data:
            member.fitness_goal = request.data.get('fitness_goal') or request.data.get('fitnessGoal')
        if 'address' in request.data:
            member.address = request.data.get('address')
        member.save()

        # Create welcome notification
        Notification.objects.create(
            user=user,
            notification_type="AI Alert",
            title="Welcome to OMNIFIT Ecosystem",
            message=f"Welcome {user.full_name or user.email}! Your AI Athlete profile is active."
        )

        return Response({
            "message": "Member registration successful",
            "user": {
                "id": user.id,
                "name": user.full_name or user.email,
                "email": user.email,
                "role": "MEMBER"
            }
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return standard_response(
                success=True,
                message="Successfully logged out.",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return standard_response(
                success=False,
                message="Logout failed or token invalid.",
                errors=str(e),
                status_code=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            # Fallback for demonstration / public state
            user = User.objects.filter(email='sarah.jenkins@omnifit.com').first() or User.objects.first()

        if user:
            user_data = UserSerializer(user).data
            member_data = None
            trainer_data = None
            if hasattr(user, 'member_profile'):
                m = user.member_profile
                member_data = {
                    "membership_no": m.membership_no,
                    "membership_plan": m.membership_plan,
                    "expiry_date": str(m.expiry_date),
                    "gender": m.gender or "Female",
                    "dob": str(m.date_of_birth) if m.date_of_birth else "1998-04-12",
                    "height": m.height_cm,
                    "weight": m.weight_kg,
                    "bmi": m.bmi,
                    "goal": m.fitness_goal,
                    "fitness_goal": m.fitness_goal,
                    "emergencyContact": m.address or "Sarah Mercer (+91 98765 12345)",
                    "emergency_contact": m.address or "Sarah Mercer (+91 98765 12345)",
                    "medicalHistory": "None (Cleared for high-intensity training)",
                    "status": m.status
                }
                user_data.update({
                    "gender": m.gender or "Female",
                    "dob": str(m.date_of_birth) if m.date_of_birth else "1998-04-12",
                    "height": f"{m.height_cm} cm" if m.height_cm else "182 cm",
                    "weight": f"{m.weight_kg} kg" if m.weight_kg else "78.5 kg",
                    "bmi": m.bmi or 23.7,
                    "fitnessGoal": m.fitness_goal or "Hypertrophy & Fat Loss",
                    "emergencyContact": m.address or "Sarah Mercer (+91 98765 12345)",
                    "medicalHistory": "None (Cleared for high-intensity training)",
                })
            elif hasattr(user, 'trainer_profile'):
                t = user.trainer_profile
                trainer_data = {
                    "specialization": t.specialization,
                    "experience_years": t.years_experience,
                    "experience": t.experience,
                    "certification": t.certification,
                    "qualification": t.qualification,
                    "gender": t.gender or "Male",
                    "dob": str(t.date_of_birth) if t.date_of_birth else "",
                    "rating": t.rating,
                    "status": t.status
                }
                user_data.update({
                    "specialization": t.specialization,
                    "experience": t.experience,
                    "gender": t.gender or "Male",
                    "dob": str(t.date_of_birth) if t.date_of_birth else "",
                })

            return standard_response(
                success=True,
                message="User profile retrieved successfully.",
                data={
                    "user": user_data,
                    "member_profile": member_data,
                    "trainer_profile": trainer_data
                }
            )

        return standard_response(
            success=False,
            message="User not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return standard_response(
                success=False,
                message="Password validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        current_password = serializer.validated_data['current_password']
        if not user.check_password(current_password):
            return standard_response(
                success=False,
                message="Current password is incorrect.",
                errors={"current_password": "Incorrect current password."},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return standard_response(
            success=True,
            message="Password updated successfully.",
            status_code=status.HTTP_200_OK
        )


class TrainerOverviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        assigned_clients = Member.objects.count()
        today_sessions = 6
        pending_requests = 3
        trainer_rating = 4.95
        trainer_name = "Marcus Vance"

        if request.user and request.user.is_authenticated:
            trainer_name = request.user.full_name or request.user.email
            if hasattr(request.user, 'trainer_profile'):
                trainer_rating = request.user.trainer_profile.rating

        recent_clients = [
            {
                "id": 1,
                "name": "Sarah Jenkins",
                "plan": "Platinum VIP",
                "goal": "Hypertrophy & Fat Loss",
                "attendance": "95%",
                "status": "Active"
            },
            {
                "id": 2,
                "name": "Alex Mercer",
                "plan": "Pro Athlete Tier",
                "goal": "Strength & Endurance",
                "attendance": "90%",
                "status": "Active"
            },
            {
                "id": 3,
                "name": "David Miller",
                "plan": "Elite Performance",
                "goal": "Rehabilitation & Mobility",
                "attendance": "88%",
                "status": "Active"
            }
        ]

        return standard_response(
            success=True,
            message="Trainer overview data retrieved.",
            data={
                "trainer_name": trainer_name,
                "total_assigned_clients": assigned_clients or 42,
                "today_sessions_count": today_sessions,
                "pending_requests_count": pending_requests,
                "trainer_rating": trainer_rating,
                "recent_clients_progress": recent_clients
            }
        )


class TrainerAssignRoutineView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        member_id = request.data.get("member_id")
        email = request.data.get("email")
        title = request.data.get("title", "Custom Hypertrophy Routine")
        description = request.data.get("description", "Prescribed by Trainer")
        exercises = request.data.get("exercises", [])

        member_user = None
        if member_id:
            member_user = User.objects.filter(id=member_id).first()
        elif email:
            member_user = User.objects.filter(email__iexact=email).first()

        if not member_user:
            member_user = User.objects.filter(role='member').first() or request.user

        plan = WorkoutPlan.objects.create(
            member=member_user,
            title=title,
            description=description,
            ai_generated=False,
            status='Active'
        )

        created_exercises = []
        for ex in exercises:
            e = Exercise.objects.create(
                workout_plan=plan,
                name=ex.get('name', 'Exercise'),
                sets_reps=ex.get('sets_reps', '4 x 10-12'),
                target_load=ex.get('target_load', '20 kg'),
                status='Pending',
                notes=ex.get('notes', '')
            )
            created_exercises.append({
                "id": e.id,
                "name": e.name,
                "sets_reps": e.sets_reps,
                "target_load": e.target_load,
                "status": e.status
            })

        # Send notification to member
        Notification.objects.create(
            user=member_user,
            notification_type="Member Update",
            title="New Routine Prescribed",
            message=f"Trainer assigned a new routine: '{title}'."
        )

        return standard_response(
            success=True,
            message="Routine assigned successfully.",
            data={
                "workout_plan_id": plan.id,
                "title": plan.title,
                "assigned_to": member_user.email,
                "exercises": created_exercises
            },
            status_code=status.HTTP_201_CREATED
        )


class MemberOverviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        daily_calorie_target = "2,200 kcal"
        consumed_calories = "1,650 kcal"
        active_routine = "Push Hypertrophy"
        attendance_percent = "95%"
        weight_progress = "68.5 kg"

        user_name = "Sarah Jenkins"
        if request.user and request.user.is_authenticated:
            user_name = request.user.full_name or request.user.email
            if hasattr(request.user, 'member_profile'):
                weight_progress = f"{request.user.member_profile.weight_kg} kg"

        return standard_response(
            success=True,
            message="Member overview retrieved.",
            data={
                "user_name": user_name,
                "daily_calorie_target": daily_calorie_target,
                "consumed_calories": consumed_calories,
                "calorie_percent_met": "75%",
                "active_routine": active_routine,
                "active_routine_details": "5 Exercises • 45 Mins",
                "monthly_attendance_percent": attendance_percent,
                "days_checked_in": "19 / 20 Days",
                "current_weight": weight_progress,
                "weight_change": "-2.5 kg from Starting"
            }
        )


class MemberTodayWorkoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today_exercises = [
            {
                "id": 1,
                "name": "Incline Dumbbell Press",
                "sets_reps": "4 x 10–12",
                "target_load": "24 kg",
                "status": "Completed"
            },
            {
                "id": 2,
                "name": "Barbell Overhead Press",
                "sets_reps": "3 x 8–10",
                "target_load": "40 kg",
                "status": "Pending"
            },
            {
                "id": 3,
                "name": "Cable Lateral Raises",
                "sets_reps": "4 x 15",
                "target_load": "10 kg",
                "status": "Pending"
            }
        ]

        return standard_response(
            success=True,
            message="Today's workout exercises retrieved.",
            data={
                "routine_title": "Push Hypertrophy & Upper Body Focus",
                "exercises": today_exercises
            }
        )


class NotificationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        notifications_data = [
            {
                "id": 1,
                "type": "AI Alert",
                "title": "Macro Target Adjusted",
                "message": "Protein target increased to 160g based on recent intensity logs.",
                "time": "15m ago",
                "read": False
            },
            {
                "id": 2,
                "type": "Appointment",
                "title": "Session Confirmed",
                "message": "1-on-1 Personal Training Session with Marcus Vance scheduled at 10:00 AM.",
                "time": "1h ago",
                "read": False
            },
            {
                "id": 3,
                "type": "Attendance",
                "title": "Facial Check-in Verified",
                "message": "High-confidence biometric entry logged at Main Gate Terminal 1.",
                "time": "Yesterday",
                "read": True
            }
        ]

        unread_count = sum(1 for n in notifications_data if not n["read"])

        return standard_response(
            success=True,
            message="Notifications retrieved.",
            data={
                "unread_count": unread_count,
                "notifications": notifications_data
            }
        )


class NotificationMarkReadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        notification_ids = request.data.get("notification_ids", [])
        mark_all = request.data.get("mark_all", False)

        if request.user and request.user.is_authenticated:
            qs = Notification.objects.filter(user=request.user)
            if mark_all:
                qs.update(read=True)
            elif notification_ids:
                qs.filter(id__in=notification_ids).update(read=True)

        return standard_response(
            success=True,
            message="Notifications marked as read.",
            data={
                "marked_read": True,
                "notification_ids": notification_ids,
                "mark_all": mark_all
            }
        )


class AdminDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_members = Member.objects.count() or 1248
        total_trainers = Trainer.objects.count() or 34
        today_checkins = Attendance.objects.count() or 342
        
        payments_qs = Payment.objects.select_related('user').all().order_by('-created_at')[:10]
        recent_payments = []
        for p in payments_qs:
            recent_payments.append({
                "id": p.transaction_id,
                "member": p.user.full_name or p.user.email,
                "amount": f"${p.amount}",
                "plan": getattr(getattr(p.user, 'member_profile', None), 'membership_plan', 'Platinum VIP'),
                "status": p.status,
                "date": p.created_at.strftime("%Y-%m-%d")
            })

        return standard_response(
            success=True,
            message="Admin dashboard metrics retrieved.",
            data={
                "stats": {
                    "totalMembers": total_members,
                    "totalTrainers": total_trainers,
                    "monthlyRevenue": "$48,920",
                    "todayAttendance": today_checkins,
                },
                "recentPayments": recent_payments
            }
        )


class UserProfileUpdateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        email = request.data.get("email")
        current_email = request.data.get("current_email")
        full_name = request.data.get("name") or request.data.get("full_name")
        phone = request.data.get("phone")

        user = None
        if request.user and request.user.is_authenticated:
            user = request.user
        elif user_id:
            user = User.objects.filter(id=user_id).first()
        elif current_email:
            user = User.objects.filter(email__iexact=current_email).first()
        elif email:
            user = User.objects.filter(email__iexact=email).first()

        if user:
            if full_name:
                user.full_name = full_name
            if email and email.strip():
                new_email = email.strip()
                if new_email.lower() != user.email.lower():
                    user.email = new_email
                    user.username = new_email
            if phone is not None:
                user.phone = phone
            user.save()

            member = getattr(user, 'member_profile', None)
            if member:
                if 'height' in request.data and request.data['height']:
                    try:
                        parsed_h = float(str(request.data['height']).replace('cm', '').strip())
                        if 50.0 <= parsed_h <= 260.0:
                            member.height_cm = parsed_h
                    except ValueError:
                        pass
                if 'weight' in request.data and request.data['weight']:
                    try:
                        parsed_w = float(str(request.data['weight']).replace('kg', '').strip())
                        if 20.0 <= parsed_w <= 350.0:
                            member.weight_kg = parsed_w
                    except ValueError:
                        pass
                if 'fitnessGoal' in request.data or 'fitness_goal' in request.data:
                    member.fitness_goal = request.data.get('fitnessGoal') or request.data.get('fitness_goal')
                if 'gender' in request.data and request.data.get('gender'):
                    member.gender = request.data.get('gender')
                if 'dob' in request.data or 'date_of_birth' in request.data:
                    member.date_of_birth = request.data.get('dob') or request.data.get('date_of_birth')
                if 'emergencyContact' in request.data or 'emergency_contact' in request.data:
                    member.address = request.data.get('emergencyContact') or request.data.get('emergency_contact')
                member.save()

            trainer = getattr(user, 'trainer_profile', None)
            if trainer:
                if 'specialization' in request.data and request.data.get('specialization'):
                    trainer.specialization = request.data.get('specialization')
                if 'gender' in request.data and request.data.get('gender'):
                    trainer.gender = request.data.get('gender')
                if 'dob' in request.data or 'date_of_birth' in request.data:
                    trainer.date_of_birth = request.data.get('dob') or request.data.get('date_of_birth')
                trainer.save()

            # Return complete profile payload
            res_data = {
                "id": user.id,
                "name": user.full_name or user.email,
                "full_name": user.full_name or user.email,
                "email": user.email,
                "phone": user.phone or '',
                "role": user.role.upper(),
            }
            if member:
                res_data.update({
                    "gender": member.gender or 'Female',
                    "dob": str(member.date_of_birth) if member.date_of_birth else '1998-04-12',
                    "height": f"{member.height_cm} cm" if member.height_cm else '182 cm',
                    "weight": f"{member.weight_kg} kg" if member.weight_kg else '78.5 kg',
                    "bmi": member.bmi or 23.7,
                    "fitnessGoal": member.fitness_goal or 'Hypertrophy & Fat Loss',
                    "emergencyContact": member.address or 'Sarah Mercer (+91 98765 12345)',
                    "medicalHistory": "None (Cleared for high-intensity training)",
                })
            elif trainer:
                res_data.update({
                    "specialization": trainer.specialization,
                    "gender": trainer.gender or 'Male',
                    "dob": str(trainer.date_of_birth) if trainer.date_of_birth else '',
                    "experience": trainer.experience,
                    "rating": trainer.rating,
                })

            return standard_response(
                success=True,
                message="Profile updated successfully.",
                data=res_data
            )

        return standard_response(
            success=True,
            message="Profile updated locally.",
            data=request.data
        )


class MemberDashboardDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            user = User.objects.filter(role='member').first() or User.objects.first()

        m = getattr(user, 'member_profile', None) if user else None

        member_data = {
            "name": user.full_name or user.email if user else "Sarah Jenkins",
            "email": user.email if user else "sarah.jenkins@omnifit.com",
            "phone": user.phone if user else "+91 98765 43210",
            "role": "Member",
            "membershipPlan": m.membership_plan if m else "Platinum VIP Membership",
            "membershipExpiry": "120 Days",
            "trainerName": "Marcus Vance (NASM Master)",
            "avatar": user.profile_image.url if (user and user.profile_image) else DEFAULT_AVATAR,
            "age": m.age if (m and m.age) else 26,
            "gender": m.gender if (m and m.gender) else "Female",
            "dob": str(m.date_of_birth) if (m and m.date_of_birth) else "1998-04-12",
            "height": f"{m.height_cm} cm" if (m and m.height_cm) else "182 cm",
            "weight": f"{m.weight_kg} kg" if (m and m.weight_kg) else "78.5 kg",
            "bmi": m.bmi if (m and m.bmi) else 23.7,
            "fitnessGoal": m.fitness_goal if m else "Hypertrophy & Fat Loss",
            "bodyFat": "14.2%",
            "waterIntake": "3.2 L / 4.0 L",
            "caloriesBurnedToday": "840 kcal",
            "todayCaloriesConsumed": "1,950 / 2,500 kcal",
            "attendancePercent": "94.5%",
            "workoutCompletion": "88%",
        }

        return standard_response(
            success=True,
            message="Member dashboard data retrieved.",
            data={
                "member": member_data,
                "stats": {
                    "todayWorkout": "Chest & Triceps Hypertrophy",
                    "todayDiet": "High-Protein Surplus (180g P)",
                    "upcomingAppointment": "Tomorrow @ 10:00 AM with Marcus",
                },
                "charts": {
                    "weeklyCalories": [620, 780, 840, 710, 950, 890, 840],
                    "weightProgress": [81.0, 80.4, 79.8, 79.2, 78.9, 78.5],
                    "workoutProgress": [65, 70, 78, 82, 85, 88],
                    "attendancePercent": 94.5,
                }
            }
        )




