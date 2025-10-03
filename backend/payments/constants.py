from enum import Enum


class PaymentStates(str, Enum):
    APPROVED = "APPROVED"
    PENDING = "PENDING"
    FAILURE = "FAILURE"