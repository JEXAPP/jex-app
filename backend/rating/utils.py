from typing import Union

from rating.models import Rating
from rating.models.behavior import Behavior


def has_already_rated(event: Union[int, object], rater, rated_user) -> bool:
    if not rater or not rated_user:
        return False

    # Accept either event instance or event id
    event_id = getattr(event, "id", event)

    try:
        return Rating.objects.filter(
            behavior__user=rated_user,
            rater=rater,
            event_id=event_id,
        ).exists()
    except Exception:
        # On unexpected error, behave as if not rated to avoid blocking reads
        return False

def get_user_average_rating(user):
    user_id = getattr(user, "id", user)
    behavior = Behavior.objects.filter(user_id=user_id).first()
    return behavior.average_rating if behavior else None

def get_user_rating_count(user):
    user_id = getattr(user, "id", user)
    return Rating.objects.filter(behavior__user_id=user_id).count() or 0