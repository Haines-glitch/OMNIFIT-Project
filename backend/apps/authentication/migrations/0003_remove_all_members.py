from django.db import migrations

def remove_members(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Member = apps.get_model('members', 'Member')
    WorkoutPlan = apps.get_model('workouts', 'WorkoutPlan')
    Exercise = apps.get_model('workouts', 'Exercise')
    Payment = apps.get_model('payments', 'Payment')
    DietPlan = apps.get_model('diet', 'DietPlan')
    Attendance = apps.get_model('attendance', 'Attendance')
    Notification = apps.get_model('authentication', 'Notification')
    Appointment = apps.get_model('authentication', 'Appointment')

    # Find all users with role 'member' or having a member profile
    member_user_ids = list(User.objects.filter(role='member').values_list('id', flat=True))
    profile_user_ids = list(Member.objects.values_list('user_id', flat=True))
    all_target_ids = list(set(member_user_ids + profile_user_ids))

    if all_target_ids:
        # Delete related workout plans and exercises
        plans = WorkoutPlan.objects.filter(member_id__in=all_target_ids)
        Exercise.objects.filter(workout_plan__in=plans).delete()
        plans.delete()

        # Delete related payments, diet plans, attendances, appointments, notifications
        Payment.objects.filter(user_id__in=all_target_ids).delete()
        DietPlan.objects.filter(member_id__in=all_target_ids).delete()
        Attendance.objects.filter(user_id__in=all_target_ids).delete()
        Notification.objects.filter(user_id__in=all_target_ids).delete()
        Appointment.objects.filter(member_id__in=all_target_ids).delete()

    # Delete all Member profile records
    Member.objects.all().delete()

    # Delete User records where role is 'member' (never touch admin or trainer)
    del_count, _ = User.objects.filter(role='member').exclude(role__in=['admin', 'trainer']).delete()
    print(f"[OMNIFIT] Cleaned up {del_count} member records. Admin and Trainer credentials preserved.")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0002_alter_user_options_user_status_alter_user_table_and_more'),
        ('members', '0003_member_address_member_age_member_date_of_birth_and_more'),
        ('workouts', '0003_exercise_completed_at_exercise_video_proof_and_more'),
        ('payments', '0002_alter_payment_options_payment_plan_name_and_more'),
        ('diet', '0001_initial'),
        ('attendance', '0003_alter_attendance_options_attendance_status_and_more'),
    ]

    operations = [
        migrations.RunPython(remove_members, reverse_code=migrations.RunPython.noop),
    ]
