from user_auth.models.employee import EmployeeProfile
from user_auth.models.employer import EmployerProfile
from rating.models import Rating

def has_already_rated(user, event_id, rater_type="employee"):
    if not user or not user.is_authenticated:
        return None

    if rater_type == "employee":
        try:
            profile = EmployeeProfile.objects.get(user=user)
        except EmployeeProfile.DoesNotExist:
            return None
        rater = profile.user  # CustomUser
    elif rater_type == "employer":
        try:
            profile = EmployerProfile.objects.get(user=user)
        except EmployerProfile.DoesNotExist:
            return None
        rater = profile.user  # CustomUser
    else:
        return None

    return Rating.objects.filter(rater=rater, event_id=event_id).exists()