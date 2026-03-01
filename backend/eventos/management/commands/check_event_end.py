from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
import logging

from eventos.models import Event, EventState
from eventos.constants import EventStates
from vacancies.models import VacancyState
from vacancies.constants import VacancyStates
from applications.models import Offer
from applications.models.attendance import Attendance
from applications.models.offer_state import OfferState
from applications.constants import OfferStates

from stream_chat import StreamChat
from django.conf import settings

logger = logging.getLogger(__name__)


def get_state_or_raise(StateModel, enum_value):
    try:
        return StateModel.objects.get(name=enum_value)
    except StateModel.DoesNotExist:
        raise RuntimeError(f"{StateModel.__name__} no tiene el estado '{enum_value}'")


def combine_date_time_to_dt(date_field, time_field):
    from django.utils import timezone as dj_tz
    import datetime
    naive = datetime.datetime.combine(date_field, time_field)
    tz = dj_tz.get_current_timezone()
    return dj_tz.make_aware(naive, tz) if dj_tz.settings.USE_TZ else naive


class Command(BaseCommand):
    help = "Verifica si hay eventos finalizados y actualiza estados"

    def handle(self, *args, **options):
        now = timezone.now()
        logger.info("check_event_end running at %s", now)

        client = StreamChat(
            api_key=settings.STREAM_API_KEY,
            api_secret=settings.STREAM_API_SECRET
        )

        try:
            published = get_state_or_raise(EventState, EventStates.PUBLISHED.value)
            in_progress = get_state_or_raise(EventState, EventStates.IN_PROGRESS.value)
            finalized = get_state_or_raise(EventState, EventStates.FINALIZED.value)
            vac_active = get_state_or_raise(VacancyState, VacancyStates.ACTIVE.value)
            vac_expired = get_state_or_raise(VacancyState, VacancyStates.EXPIRED.value)
            offer_pending = get_state_or_raise(OfferState, OfferStates.PENDING.value)
            offer_accepted = get_state_or_raise(OfferState, OfferStates.ACCEPTED.value)
            offer_completed = get_state_or_raise(OfferState, OfferStates.COMPLETED.value)
            offer_not_shown = get_state_or_raise(OfferState, OfferStates.NOT_SHOWN.value)
            offer_expired = get_state_or_raise(OfferState, OfferStates.EXPIRED.value)

        except RuntimeError as e:
            logger.error("Estados faltantes: %s", e)
            return

        events = Event.objects.filter(state__in=[published, in_progress]).filter(
            Q(end_date__lt=now.date()) |
            Q(end_date=now.date(), end_time__lt=now.time())
        )

        total_finalized = 0
        for ev in events:
            end_dt = combine_date_time_to_dt(ev.end_date, ev.end_time)
            if end_dt <= now:
                with transaction.atomic():
                    ev.state = finalized

                    try:
                        if ev.stream_announcements_channel_id:
                            client.channel("announcements", ev.stream_announcements_channel_id).delete()
                            logger.info(f"Canal de anuncios eliminado: {ev.stream_announcements_channel_id}")

                        if ev.stream_workers_channel_id:
                            client.channel("messaging", ev.stream_workers_channel_id).delete()
                            logger.info(f"Canal de trabajadores eliminado: {ev.stream_workers_channel_id}")

                    except Exception as e:
                        logger.warning(f"Error al eliminar canales de StreamChat del evento {ev.pk}: {e}")

                    ev.stream_announcements_channel_id = None
                    ev.stream_workers_channel_id = None

                    ev.save(update_fields=[
                        "state",
                        "updated_at",
                        "stream_announcements_channel_id",
                        "stream_workers_channel_id"
                    ])
                    total_finalized += 1

                    ev.vacancies.filter(state=vac_active).update(state=vac_expired)

                    offers_qs = Offer.objects.filter(selected_shift__vacancy__event=ev).distinct()

                    pending_qs = offers_qs.filter(state=offer_pending)
                    n_pending = pending_qs.update(state=offer_expired, updated_at=now)

                    accepted_qs = offers_qs.filter(state=offer_accepted)
                    n_completed = 0
                    n_not_shown = 0
                    for offer in accepted_qs:
                        attended = Attendance.objects.filter(
                            shift_id=offer.selected_shift_id,
                            employee_id=offer.employee_id
                        ).exists()
                        offer.state = offer_completed if attended else offer_not_shown
                        offer.updated_at = now
                        offer.save(update_fields=["state", "updated_at"])
                        n_completed += 1 if attended else 0
                        n_not_shown += 0 if attended else 1

                    logger.info(
                        "Evento %s finalizado: pendientes expiradas=%d, completadas=%d, no mostradas=%d",
                        ev.pk, n_pending, n_completed, n_not_shown
                    )

        logger.info("check_event_end finished. total_finalized=%d", total_finalized)

