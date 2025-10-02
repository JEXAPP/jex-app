from enum import Enum

class PenaltyStates(str, Enum):
    IN_REVIEW = "IN_REVIEW"
    REJECTED = "REJECTED"
    ACCEPTED = "ACCEPTED"


class RatingMessages:
    BODY_MUST_BE_ARRAY = "El body debe ser un array de objetos."
    RATINGS_SAVED = "Se guardaron las calificaciones correctamente."
    SOME_RATINGS_NOT_SAVED = "Algunas calificaciones no se guardaron."