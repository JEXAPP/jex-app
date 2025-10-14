# project/celery.py
import os
from celery import Celery

# Configurar settings de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('project')

# Usar configuración de Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descubrir automáticamente tasks.py en todas las apps
app.autodiscover_tasks()