from django.db import migrations

def create_penalty_categories(apps, schema_editor):
    PenaltyCategory = apps.get_model('rating', 'PenaltyCategory')
    PenaltyType = apps.get_model('rating', 'PenaltyType')

    # --- Categoría 1: Compromiso y puntualidad ---
    compromiso = PenaltyCategory.objects.create(name="Compromiso y puntualidad")
    PenaltyType.objects.bulk_create([
        PenaltyType(category=compromiso, name="Llega tarde"),
        PenaltyType(category=compromiso, name="No confirma asistencia"),
        PenaltyType(category=compromiso, name="Trabaja desinteresadamente"),
    ])

    # --- Categoría 2: Responsabilidad laboral ---
    responsabilidad = PenaltyCategory.objects.create(name="Responsabilidad laboral")
    PenaltyType.objects.bulk_create([
        PenaltyType(category=responsabilidad, name="No presentarse al turno"),
        PenaltyType(category=responsabilidad, name="Abandonar turno"),
        PenaltyType(category=responsabilidad, name="No cumplir funciones encomendadas"),
    ])

    # --- Categoría 3: Conducta inadecuada ---
    conducta = PenaltyCategory.objects.create(name="Conducta inadecuada")
    PenaltyType.objects.bulk_create([
        PenaltyType(category=conducta, name="Conducta violenta"),
        PenaltyType(category=conducta, name="Fraude"),
        PenaltyType(category=conducta, name="Robo"),
    ])

    # --- Categoría 4: Otro ---
    otro = PenaltyCategory.objects.create(name="Otro")
    PenaltyType.objects.create(category=otro, name="Otro")


def remove_penalty_categories(apps, schema_editor):
    PenaltyType = apps.get_model('rating', 'PenaltyType')
    PenaltyCategory = apps.get_model('rating', 'PenaltyCategory')
    PenaltyType.objects.all().delete()
    PenaltyCategory.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("rating", "0006_penaltycategory_penaltytype_penalty_penalty_type"),
    ]

    operations = [
        migrations.RunPython(create_penalty_categories, remove_penalty_categories),
    ]
