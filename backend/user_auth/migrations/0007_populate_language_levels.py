from django.db import migrations

LANGUAGE_LEVELS = [
    {
        "name": "Básico",
    },
    {
        "name": "Intermedio",
    },
    {
        "name": "Avanzado",
    },
    {
        "name": "Nativo",
    },
]


def populate_language_levels(apps, schema_editor):
    LanguageLevel = apps.get_model('user_auth', 'LanguageLevel')
    for level in LANGUAGE_LEVELS:
        LanguageLevel.objects.get_or_create(
            name=level["name"],
        )


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0006_languagelevel_employeelanguage'),
    ]

    operations = [
        migrations.RunPython(populate_language_levels),
    ]
