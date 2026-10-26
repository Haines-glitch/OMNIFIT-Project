from django.db import migrations

def remove_goutham(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Member = apps.get_model('members', 'Member')

    target_email = 'gouthamsreekumar2027@mca.ajce.in'
    users = User.objects.filter(email__iexact=target_email) | User.objects.filter(email__icontains='goutham')
    user_ids = list(users.values_list('id', flat=True))

    if user_ids:
        Member.objects.filter(user_id__in=user_ids).delete()
        del_count, _ = User.objects.filter(id__in=user_ids).exclude(role__in=['admin', 'trainer']).delete()
        print(f"[OMNIFIT] Removed {del_count} account(s) matching '{target_email}'.")
    else:
        print(f"[OMNIFIT] No accounts found matching '{target_email}'.")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0006_delete_goutham_member'),
    ]

    operations = [
        migrations.RunPython(remove_goutham, reverse_code=migrations.RunPython.noop),
    ]
