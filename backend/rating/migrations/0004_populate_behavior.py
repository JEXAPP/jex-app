from django.db import migrations
from django.utils import timezone

def create_behavior_for_users(apps, schema_editor):
    CustomUser = apps.get_model('user_auth', 'CustomUser')  # O 'user_auth', 'CustomUser' si ese es el nombre correcto
    Behavior = apps.get_model('rating', 'Behavior')
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
        ('rating', '0003_alter_behavior_average_rating'),
]

    operations = [
        migrations.RunPython(create_behavior_for_users),
    ]