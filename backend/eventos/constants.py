from enum import Enum
from django.db.models import Func


class EventStates(str, Enum):
    DRAFT = "Borrador"
    PUBLISHED = "Publicado"
    IN_PROGRESS = "En curso"
    FINALIZED = "Finalizado"
    CANCELLED = "Cancelado"

class CategoryEnum(str, Enum):
    CONCIERTO = "Concierto"
    FESTIVAL = "Festival"
    CASAMIENTO = "Casamiento"
    EVENTO_CORPORATIVO = "Evento corporativo"
    FERIA = "Feria"
    DESFILE = "Desfile"
    EVENTO_DEPORTIVO = "Evento deportivo"
    OTROS = "Otros"

class Unaccent(Func):
    function = 'UNACCENT'