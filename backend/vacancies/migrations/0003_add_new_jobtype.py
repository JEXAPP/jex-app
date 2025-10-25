from django.db import migrations


def create_new_jobtypes(apps, schema_editor):
    JobType = apps.get_model('vacancies', 'JobType')

    try:
        from vacancies.constants import JobTypeEnum2
    except Exception:
        # Si no existe JobTypeEnum2 o hay error al importarlo, no hacemos nada
        return

    for member in JobTypeEnum2:
        name = str(member.value).strip()
        if name:
            JobType.objects.get_or_create(name=name)


def delete_new_jobtypes(apps, schema_editor):
    """
    Reverse: eliminar los job types definidos en JobTypeEnum2.
    Atención: esto borra por nombre exacto. Si un jobtype con ese nombre existía
    antes de ejecutar la migración, también será eliminado.
    """
    JobType = apps.get_model('vacancies', 'JobType')

    try:
        from vacancies.constants import JobTypeEnum2
    except Exception:
        # Si el enum no existe en el momento del rollback, no eliminar nada
        return

    names = [str(member.value).strip() for member in JobTypeEnum2 if str(member.value).strip()]
    if not names:
        return

    JobType.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('vacancies', '0002_populate_enums'),
    ]

    operations = [
        migrations.RunPython(create_new_jobtypes, reverse_code=delete_new_jobtypes),
    ]
