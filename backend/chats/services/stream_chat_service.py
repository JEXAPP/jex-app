from django.conf import settings
from stream_chat import StreamChat
import logging
from applications.models.offers import Offer
from applications.models.offer_state import OfferState
from applications.constants import OfferStates
import re


client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)
logger = logging.getLogger(__name__)


def stream_user_id(user):
    return str(user.id)


def upsert_user(user):
    """Asegura que el usuario exista en Stream y retorna su UID."""
    uid = stream_user_id(user)
    data = {
        "id": uid,
        "name": user.get_full_name() or user.email,
        "role": "employer" if user.is_employer() else "employee",
    }
    if user.profile_image:
        data["image"] = user.profile_image.url
    client.upsert_user(data)
    return uid


def create_user_token(user):
    uid = stream_user_id(user)
    return client.create_token(uid)


def get_or_create_channel(channel_type, channel_id, created_by_user_id, members=None, extra_data=None):
    channel = client.channel(channel_type, channel_id)
    try:
        channel.create(
            created_by_user_id,
            data={
                "members": members or [],
                "created_by_id": created_by_user_id,
                **(extra_data or {})
            }
        )
    except Exception as e:
        if "Channel already exists" in str(e):
            logger.info(f"Canal {channel_id} ya existe en {channel_type}.")
        else:
            logger.error(f"Error creando canal {channel_id}: {e}")
            raise
    return channel



def add_members_to_channel(channel_type, channel_id, member_ids):
    channel = client.channel(channel_type, channel_id)
    channel.add_members(member_ids)


def add_single_member(channel_type, channel_id, member_id):
    add_members_to_channel(channel_type, channel_id, [member_id])


def send_system_message(channel_type, channel_id, text):
    system_user = {"id": "system", "name": "Sistema"}
    client.upsert_user(system_user)
    channel = client.channel(channel_type, channel_id)
    channel.send_message({"text": text}, system_user["id"])

def slugify_channel_id(prefix: str, name: str) -> str:
    """
    Genera un channel_id válido para StreamChat.
    Solo permite: a-z, 0-9, _ y -
    Reemplaza espacios por _, quita otros caracteres.
    """
    s = name.lower()                  # minúsculas
    s = re.sub(r"\s+", "_", s)       # espacios → _
    s = re.sub(r"[^a-z0-9_-]", "", s)  # eliminar caracteres inválidos
    return f"{prefix}-{s}"


def sync_offer_chat(offer):
    """
    Sincroniza canales de Stream al aceptar una oferta:
    - Crea canal de anuncios (empleador + empleados).
    - Crea canal de empleados (entre empleados cuando >= 2).
    - Añade miembros a los canales existentes.
    """

    vacancy = offer.selected_shift.vacancy
    event = vacancy.event

    employer_uid = upsert_user(offer.employer.user)
    employee_uid = upsert_user(offer.employee.user)

    # -----------------
    # 1. Canal de avisos (empleador + empleados)
    # -----------------
    ann_channel_id = slugify_channel_id("ForoGrupal", event.name)

    if not event.stream_announcements_channel_id:
        get_or_create_channel(
            channel_type="announcements",
            channel_id=ann_channel_id,
            created_by_user_id=employer_uid,
            members=[employer_uid, employee_uid],
            extra_data={"event_id": str(event.pk), "name": f"Foro Grupal - {event.name}"}
        )
        event.stream_announcements_channel_id = ann_channel_id
        event.save(update_fields=["stream_announcements_channel_id"])
    else:
        add_single_member("announcements", ann_channel_id, employee_uid)

    # -----------------
    # 2. Canal de empleados
    # -----------------
    workers_channel_id = slugify_channel_id("Trabajadores", event.name)

    accepted_state = OfferState.objects.get(name=OfferStates.ACCEPTED.value)
    accepted_offers = Offer.objects.filter(
        selected_shift__vacancy__event=event,
        state=accepted_state
    ).select_related("employee__user")

    accepted_employee_ids = [upsert_user(o.employee.user) for o in accepted_offers]
    print(accepted_employee_ids)

    if len(accepted_employee_ids) == 2 and not event.stream_workers_channel_id:
        get_or_create_channel(
            channel_type="messaging",
            channel_id=workers_channel_id,
            created_by_user_id=accepted_employee_ids[0],
            members=accepted_employee_ids,
            extra_data={"event_id": str(event.pk), "name": f"Trabajadores - {event.name}"}
        )
        event.stream_workers_channel_id = workers_channel_id
        event.save(update_fields=["stream_workers_channel_id"])
    elif len(accepted_employee_ids) > 2:
        add_single_member("messaging", workers_channel_id, employee_uid)
