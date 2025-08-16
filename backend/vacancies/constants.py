from enum import Enum
from django.db.models import Func

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