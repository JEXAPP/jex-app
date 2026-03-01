from enum import Enum


class PaymentStates(str, Enum):
    APPROVED = "APPROVED"
    PENDING = "PENDING"
    FAILURE = "FAILURE"


MP_FEE_PERCENT = 0.0653
APP_FEE_PERCENT = 0.0347