from enum import Enum


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