from enum import Enum
from django.db.models import Func


class EventStates(str, Enum):
    DRAFT = "Borrador"
    PUBLISHED = "Publicado"
    IN_PROGRESS = "En curso"
    FINALIZED = "Finalizado"
    CANCELLED = "Cancelado"

class VacancyStates(str, Enum):
    DRAFT = "En Borrador"
    ACTIVE = "Activa"
    OCULTED = "Oculta"
    FILLED = "Llena"
    EXPIRED = "Vencida"
    DELETED = "Eliminada"

class JobTypesEnum(str, Enum):
    BARMAN = "Barman"
    FOTOGRAFO = "Fotógrafo"
    SONIDISTA = "Sonidista"
    ILUMINADOR = "Iluminador"
    CAMARERO = "Camarero"
    SEGURIDAD = "Seguridad"
    RECEPCIONISTA = "Recepcionista"
    TECNICO_ESCENARIO = "Técnico de escenario"
    PRODUCTOR = "Productor"
    ANIMADOR = "Animador"
    OTRO = "Otro"

class CategoryEnum(str, Enum):
    CONCIERTO = "Concierto"
    FESTIVAL = "Festival"
    CASAMIENTO = "Casamiento"
    EVENTO_CORPORATIVO = "Evento corporativo"
    FERIA = "Feria"
    DESFILE = "Desfile"
    EVENTO_DEPORTIVO = "Evento deportivo"
    OTROS = "Otros"


class ApplicationStates(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    CANCELED = "CANCELED"

class Unaccent(Func):
    function = 'UNACCENT'

ORDERING_MAP = {
    "start_date_asc": "shifts__start_date",
    "start_date_desc": "-shifts__start_date",
    "payment_asc": "shifts__payment",
    "payment_desc": "-shifts__payment",
    "role_asc": "job_type__name",
    "role_desc": "-job_type__name",
}