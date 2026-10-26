from django.db import migrations

def reset_pending_members(apps, schema_editor):
    User = apps.get_model('authentication', 'User')
    Member = apps.get_model('members', 'Member')

    # Find members who were automatically activated or assigned without approval
    members_to_reset = User.objects.filter(role='member')
    count = members_to_reset.count()

    for u in members_to_reset:
        u.status = 'Pending Approval'
        u.save()
        Member.objects.filter(user=u).update(status='Pending', assigned_trainer=None)

    print(f"[OMNIFIT] Reset {count} member(s) to 'Pending Approval' with unassigned trainer awaiting trainer review.")

class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0004_keep_only_anandhu_trainer'),
    ]

    operations = [
        migrations.RunPython(reset_pending_members, reverse_code=migrations.RunPython.noop),
    ]
