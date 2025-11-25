from enum import Enum

class PenaltyStates(str, Enum):
    IN_REVIEW = "En Revisión"
    REJECTED = "Rechazada"
    ACCEPTED = "Aceptada"
