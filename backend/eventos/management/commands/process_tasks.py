from django.core.management.base import BaseCommand
from django.core import management
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Ejecuta los procesos automáticos de eventos y ofertas (inicio, finalización y expiración)"

    def handle(self, *args, **options):
        logger.info("=== Iniciando ejecución automática de eventos ===")

        try:
            management.call_command('check_event_start')
            logger.info("✔ check_event_start ejecutado correctamente")
        except Exception as e:
            logger.exception("❌ Error ejecutando check_event_start: %s", e)

        try:
            management.call_command('check_event_end')
            logger.info("✔ check_event_end ejecutado correctamente")
        except Exception as e:
            logger.exception("❌ Error ejecutando check_event_end: %s", e)

        try:
            management.call_command('expire_offers')
            logger.info("✔ expire_offers ejecutado correctamente")
        except Exception as e:
            logger.exception("❌ Error ejecutando expire_offers: %s", e)

        logger.info("=== Proceso automático completado ===")
