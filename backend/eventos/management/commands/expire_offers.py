from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
import logging

from applications.models import Offer
from applications.models.offer_state import OfferState
from applications.constants import OfferStates

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Expira ofertas cuyo tiempo de vigencia terminó"

    def handle(self, *args, **options):
        now = timezone.now()
        logger.info("expire_offers running at %s", now)

        try:
            offer_pending = OfferState.objects.get(name=OfferStates.PENDING.value)
            offer_expired = OfferState.objects.get(name=OfferStates.EXPIRED.value)
        except OfferState.DoesNotExist as e:
            logger.error("Estados faltantes: %s", e)
            return

        offers = Offer.objects.filter(state=offer_pending).filter(
            Q(expiration_date__lt=now.date()) |
            Q(expiration_date=now.date(), expiration_time__lt=now.time())
        )

        n = offers.update(state=offer_expired, updated_at=now)
        logger.info("expire_offers: expired %d offers", n)
