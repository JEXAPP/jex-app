from enum import Enum
from django.db.models import Func


class EventStates(str, Enum):
    DRAFT = "Borrador"
    PUBLISHED = "Publicado"
    IN_PROGRESS = "En curso"
    FINALIZED = "Finalizado"
    CANCELLED = "Cancelado"
    DELETED = "Eliminado"

class CategoryEnum(str, Enum):
    CONCIERTO = "Concierto"
    FESTIVAL = "Festival"
    CASAMIENTO = "Casamiento"
    EVENTO_CORPORATIVO = "Evento corporativo"
    FERIA = "Feria"
    DESFILE = "Desfile"
    EVENTO_DEPORTIVO = "Evento deportivo"
    OTROS = "Otros"
class CategoryEnum2(Enum):
    CONFERENCIA = "Conferencia"
    EXPO = "Expo"
    SEMINARIO = "Seminario"
    BIRTHDAY = "Cumpleaños"
    FIESTASECRETA = "Fiesta secreta"
    BABYSHOWER = "Baby shower"
    ANIVERSARIO = "Aniversario"
    OBRATEATRO = "Obra de teatro"
    FERIA = "Feria"

class Unaccent(Func):
    function = 'UNACCENT'


OFFER_VALID_STATES = ['ACCEPTED', 'NOT_SHOWN', 'COMPLETED']