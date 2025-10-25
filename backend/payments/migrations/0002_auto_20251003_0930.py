
from django.db import migrations
from payments.constants import PaymentStates

def create_payment_states(apps, schema_editor):
    PaymentState = apps.get_model("payments", "PaymentState")
    for state in PaymentStates:
        PaymentState.objects.get_or_create(name=state.value)

class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_payment_states),
    ]