# events/tasks.py
from celery import shared_task
from django.utils import timezone
from django.db import transaction
from django.db.models import Q

import logging
logger = logging.getLogger(__name__)

from eventos.models import Event, EventState
from eventos.constants import EventStates
from vacancies.models import Vacancy, VacancyState, Shift
from vacancies.constants import VacancyStates
from applications.models import Offer
from applications.models.attendance import Attendance
from applications.models.offer_state import OfferState
from applications.constants import OfferStates

# Helper para obtener state object por nombre (evita hardcodear ids)
def get_state_or_raise(StateModel, enum_value):
    try:
        return StateModel.objects.get(name=enum_value)
    except StateModel.DoesNotExist:
        raise RuntimeError(f"{StateModel.__name__} no tiene el estado '{enum_value}'")

def combine_date_time_to_dt(date_field, time_field):
    """Devuelve timezone-aware datetime combinado (según settings USE_TZ)."""
    from django.utils import timezone as dj_tz
    import datetime
    naive = datetime.datetime.combine(date_field, time_field)
    tz = dj_tz.get_current_timezone()
    return dj_tz.make_aware(naive, tz) if dj_tz.settings.USE_TZ else naive

@shared_task(bind=True)
def check_event_start(self):
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

    # Buscar eventos que deben empezar: start_datetime <= now y estado = Publicado
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

                # Expirar ofertas PENDING relacionadas al evento
                # Intentamos por selected_shift -> vacancy -> event y por application->vacancy->event
                offers_qs = Offer.objects.none()
                try:
                    offers_qs = Offer.objects.filter(selected_shift__vacancy__event=ev)
                except Exception:
                    logger.exception("Error filtrando offers por selected_shift")

                offers_qs = offers_qs.filter(state=offer_pending).distinct()
                n = offers_qs.update(state=offer_expired, updated_at=now)
                logger.info("Event %s started: expired %d pending offers", ev.pk, n)

    logger.info("check_event_start finished. total_started=%d", total_started)
    return {"started": total_started}


@shared_task(bind=True)
def check_event_end(self):
    now = timezone.now()
    logger.info("check_event_end running at %s", now)
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

    # Eventos que finalizaron: end_datetime <= now y estado en (Publicado, En curso)
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
                ev.save(update_fields=["state", "updated_at"])
                total_finalized += 1

                # Vacantes -> Vencida (si estaban Activa o Llena)
                ev.vacancies.filter(state__in=[vac_active]).update(state=vac_expired, updated_at=now)

                # Ofertas: procesar por cada oferta relacionada
                offers_qs = Offer.objects.none()
                try:
                    offers_qs = Offer.objects.filter(selected_shift__vacancy__event=ev)
                except Exception:
                    logger.exception("Error filtrando offers por selected_shift")
                offers_qs = offers_qs.distinct()

                # PENDING -> EXPIRED
                pending_qs = offers_qs.filter(state=offer_pending)
                n_pending = pending_qs.update(state=offer_expired, updated_at=now)

                # ACCEPTED -> COMPLETED or NOT_SHOWN según asistencia
                accepted_qs = offers_qs.filter(state=offer_accepted)
                n_completed = 0
                n_not_shown = 0
                for offer in accepted_qs:
                    # comprobar asistencia: preferimos selected_shift si está
                    attended = False
                    try:
                        if offer.selected_shift_id:
                            attended = Attendance.objects.filter(
                                shift_id=offer.selected_shift_id,
                                employee_id=offer.employee_id
                            ).exists()
                    except Exception as e:
                        logger.exception("Error comprobando attendance para offer %s: %s", offer.pk, e)

                    if attended:
                        offer.state = offer_completed
                        n_completed += 1
                    else:
                        offer.state = offer_not_shown
                        n_not_shown += 1
                    offer.updated_at = now
                    offer.save(update_fields=["state", "updated_at"])

                logger.info(
                    "Event %s finalized: pending_expired=%d, completed=%d, not_shown=%d",
                    ev.pk, n_pending, n_completed, n_not_shown
                )

    logger.info("check_event_end finished. total_finalized=%d", total_finalized)
    return {"finalized": total_finalized}


@shared_task(bind=True)
def expire_offers(self):
    now = timezone.now()
    logger.info("expire_offers running at %s", now)
    try:
        offer_pending = get_state_or_raise(OfferState, OfferStates.PENDING.value)
        offer_expired = get_state_or_raise(OfferState, OfferStates.EXPIRED.value)
    except RuntimeError as e:
        logger.error("Estados faltantes: %s", e)
        return

    offers = Offer.objects.filter(state=offer_pending).filter(
        Q(expiration_date__lt=now.date()) |
        Q(expiration_date=now.date(), expiration_time__lt=now.time())
    )

    n = offers.update(state=offer_expired, updated_at=now)
    logger.info("expire_offers: expired %d offers", n)
    return {"expired": n}
