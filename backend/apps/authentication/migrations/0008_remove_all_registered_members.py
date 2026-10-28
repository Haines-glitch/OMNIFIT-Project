from django.db import migrations

def remove_all_members(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Member = apps.get_model('members', 'Member')

    try:
        WorkoutPlan = apps.get_model('workouts', 'WorkoutPlan')
        Exercise = apps.get_model('workouts', 'Exercise')
        Payment = apps.get_model('payments', 'Payment')
        DietPlan = apps.get_model('diet', 'DietPlan')
        Attendance = apps.get_model('attendance', 'Attendance')
        Notification = apps.get_model('authentication', 'Notification')
        Appointment = apps.get_model('authentication', 'Appointment')

        member_user_ids = list(User.objects.filter(role='member').values_list('id', flat=True))
        profile_user_ids = list(Member.objects.values_list('user_id', flat=True))
        all_target_ids = list(set(member_user_ids + profile_user_ids))

        if all_target_ids:
            plans = WorkoutPlan.objects.filter(member_id__in=all_target_ids)
            Exercise.objects.filter(workout_plan__in=plans).delete()
            plans.delete()
            Payment.objects.filter(user_id__in=all_target_ids).delete()
            DietPlan.objects.filter(member_id__in=all_target_ids).delete()
            Attendance.objects.filter(user_id__in=all_target_ids).delete()
            Notification.objects.filter(user_id__in=all_target_ids).delete()
            Appointment.objects.filter(member_id__in=all_target_ids).delete()
    except Exception as e:
        print(f"[OMNIFIT Migration] Note during related cleanup: {e}")

    # Delete all member profile records
    Member.objects.all().delete()

    # Delete all users with role 'member' (keep admin and trainer)
    del_count, _ = User.objects.filter(role='member').exclude(role__in=['admin', 'trainer']).delete()
    print(f"[OMNIFIT Migration 0008] Successfully deleted {del_count} registered members. Admins and Trainers preserved.")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0007_remove_goutham_again'),
    ]

    operations = [
        migrations.RunPython(remove_all_members, reverse_code=migrations.RunPython.noop),
    ]
