from django.db import migrations

def delete_goutham(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Member = apps.get_model('members', 'Member')

    target_email = 'gouthamsreekumar2027@mca.ajce.in'
    users_to_delete = User.objects.filter(email__iexact=target_email) | User.objects.filter(email__icontains='goutham')
    user_ids = list(users_to_delete.values_list('id', flat=True))

    if user_ids:
        Member.objects.filter(user_id__in=user_ids).delete()
        del_count, _ = User.objects.filter(id__in=user_ids).exclude(role__in=['admin', 'trainer']).delete()
        print(f"[OMNIFIT] Removed {del_count} user(s) matching '{target_email}'.")
    else:
        print(f"[OMNIFIT] No user found matching '{target_email}'.")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0005_set_member_approval_required'),
    ]

    operations = [
        migrations.RunPython(delete_goutham, reverse_code=migrations.RunPython.noop),
    ]
