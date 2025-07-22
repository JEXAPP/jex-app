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