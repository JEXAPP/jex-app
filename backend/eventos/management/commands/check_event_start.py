from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from django.db.models import Q

import logging
logger = logging.getLogger(__name__)

from eventos.models import Event, EventState
from eventos.constants import EventStates
from applications.models import Offer
from applications.models.offer_state import OfferState
from applications.constants import OfferStates


def get_state_or_raise(StateModel, enum_value):
    try:
        return StateModel.objects.get(name=enum_value)
    except StateModel.DoesNotExist:
        raise RuntimeError(f"{StateModel.__name__} no tiene el estado '{enum_value}'")


def combine_date_time_to_dt(date_field, time_field):
    """Devuelve datetime con timezone"""
    from django.utils import timezone as dj_tz
    import datetime
    naive = datetime.datetime.combine(date_field, time_field)
    tz = dj_tz.get_current_timezone()
    return dj_tz.make_aware(naive, tz) if dj_tz.settings.USE_TZ else naive


class Command(BaseCommand):
    help = "Verifica si hay eventos que deben iniciar y actualiza su estado a 'En curso'"

    def handle(self, *args, **options):
        now = timezone.now()
        logger.info("check_event_start running at %s", now)

        try:
            published = get_state_or_raise(EventState, EventStates.PUBLISHED.value)
            in_progress = get_state_or_raise(EventState, EventStates.IN_PROGRESS.value)
            offer_pending = get_state_or_raise(OfferState, OfferStates.PENDING.value)
            offer_expired = get_state_or_raise(OfferState, OfferStates.EXPIRED.value)
        except RuntimeError as e:
            logger.error("Estados faltantes: %s", e)
            return

        events = Event.objects.filter(state=published).filter(
            Q(start_date__lt=now.date()) |
            Q(start_date=now.date(), start_time__lte=now.time())
        )

        total_started = 0
        for ev in events:
            start_dt = combine_date_time_to_dt(ev.start_date, ev.start_time)
            if start_dt <= now:
                with transaction.atomic():
                    ev.state = in_progress
                    ev.save(update_fields=["state", "updated_at"])
                    total_started += 1

                    offers_qs = Offer.objects.filter(selected_shift__vacancy__event=ev, state=offer_pending)
                    n = offers_qs.update(state=offer_expired, updated_at=now)
                    logger.info("Evento %s iniciado: %d ofertas expiradas", ev.pk, n)

        logger.info("check_event_start finished. total_started=%d", total_started)