from enum import Enum

class ApplicationStates(str, Enum):
    PENDING = "PENDING"
    OFFERT = "OFFERED"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    CANCELED = "CANCELED"


class OfferStates(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    CANCELED = "CANCELED"
    EXPIRED = "EXPIRED"