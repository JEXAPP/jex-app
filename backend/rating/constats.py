from enum import Enum

class PenaltyStates(str, Enum):
    IN_REVIEW = "IN_REVIEW"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"

