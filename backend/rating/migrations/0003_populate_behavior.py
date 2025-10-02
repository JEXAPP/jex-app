from django.db import migrations
from django.utils import timezone

def create_behavior_for_users(apps, schema_editor):
    CustomUser = apps.get_model('auth', 'CustomUser')  # O 'user_auth', 'CustomUser' si ese es el nombre correcto
    Behavior = apps.get_model('tu_app', 'Behavior')
    now = timezone.now()

    for user in CustomUser.objects.all():
        Behavior.objects.get_or_create(
            user_id=user.id,
            defaults={
                'average_rating': None,
                'created_at': now,
            }
        )

class Migration(migrations.Migration):

    dependencies = [
        ('rating', '0002_populate_penalty_states'),
]

    operations = [
        migrations.RunPython(create_behavior_for_users),
    ]