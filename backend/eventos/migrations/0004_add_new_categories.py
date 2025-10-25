from django.db import migrations


def create_new_categories(apps, schema_editor):
    Category = apps.get_model('eventos', 'Category')

    try:
        from eventos.constants import CategoryEnum2
    except Exception:
        # Si no existe CategoryEnum2 o hay error al importarlo, no hacemos nada
        return

    for member in CategoryEnum2:
        name = str(member.value).strip()
        if name:
            Category.objects.get_or_create(name=name)


def delete_new_categories(apps, schema_editor):
    """
    Reverse: eliminar las categorías definidas en CategoryEnum2.
    Atención: esto borra por nombre exacto. Si una categoría con ese nombre existía
    antes de ejecutar la migración, también será eliminada.
    """
    Category = apps.get_model('eventos', 'Category')

    try:
        from eventos.constants import CategoryEnum2
    except Exception:
        # Si el enum no existe en el momento del rollback, intentar nada/no eliminar
        return

    names = [str(member.value).strip() for member in CategoryEnum2 if str(member.value).strip()]
    if not names:
        return

    # Borrar por nombre exacto
    Category.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0003_populate_enums'),
    ]

    operations = [
        migrations.RunPython(create_new_categories, reverse_code=delete_new_categories),
    ]