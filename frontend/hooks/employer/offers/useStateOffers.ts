import { useState, useEffect } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type OfferStatus = "Pendiente" | "Aceptada" | "Rechazada" | "Vencida";
export type FilterSimple = "Pendiente" | "Aceptadas" | "Otro";

export type EventState = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  name: string;
  state: EventState;
};

export type Offer = {
  id: number;
  employeeName: string;
  employeeImage: any;
  role: string;
  salary: string;        // ya formateado
  fechaInicio: string;   // dd/MM/yyyy
  horaInicio: string;    // HH:mm
  horaFin: string;       // HH:mm
  expiryDate: string;    // dd/MM/yyyy
  expiryTime: string;    // HH:mm
  status: OfferStatus;
  eventId: number;
  imageUrl: string;
  imageId: string;
};

const backendStateToStatus: Record<string, OfferStatus> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Vencida",
};

const eventStateOrder: Record<string, number> = {
  "En progreso": 1,
  "Publicado": 2,
  "Finalizado": 3,
};

const filterToBackendIds: Record<FilterSimple, number[]> = {
  Pendiente: [1],
  Aceptadas: [2],
  Otro: [3, 5],
};

export const useStateOffers = () => {
  const { requestBackend } = useBackendConection();

  const [events, setEvents] = useState<Event[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [filter, setFilter] = useState<FilterSimple>("Aceptadas");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // feedback para el botón de pago (por item)
  const [creatingPaymentId, setCreatingPaymentId] = useState<number | null>(null);

  const currentEvent: Event | null = events[currentEventIndex] ?? null;

  // Traer eventos del empleador
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await requestBackend("/api/events/by-employer/", null, "GET");
        if (Array.isArray(data)) {
          const normalized: Event[] = data.map((e: any) => ({
            id: e.id,
            name: e.name,
            state: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Publicado",
            },
          }));

          normalized.sort((a, b) => {
            const aOrder = eventStateOrder[a.state.name] ?? 99;
            const bOrder = eventStateOrder[b.state.name] ?? 99;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.name.localeCompare(b.name);
          });

          setEvents(normalized);
        }
      } catch (err) {
        console.error("Error al traer eventos:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Traer ofertas por evento + filtro
  useEffect(() => {
    const fetchOffers = async () => {
      if (!currentEvent) return;
      setLoading(true);
      try {
        const stateIds = filterToBackendIds[filter];
        const requests = stateIds.map((sid) =>
          requestBackend(`/api/applications/offers/${currentEvent.id}/state/${sid}/`, null, "GET")
        );
        const results = await Promise.all(requests);
        const all = results.flat().filter(Boolean);

        const normalized: Offer[] = all.map((item: any) => ({
          id: item?.id ?? 0,
          employeeName: `${item?.employee_name ?? ""} ${item?.employee_lastname ?? ""}`.trim(),
          employeeImage: require("@/assets/images/jex/Jex-FotoPerfil.webp"),
          role: item?.job_type ?? "Sin rol",
          salary: new Intl.NumberFormat("es-AR").format(item?.shift?.payment ?? 0),
          fechaInicio: item?.shift?.start_date ?? "",
          horaInicio: item?.shift?.start_time ?? "",
          horaFin: item?.shift?.end_time ?? "",
          expiryDate: item?.expiration_date ?? "",
          expiryTime: item?.expiration_time ?? "",
          status: backendStateToStatus[item?.offer_state?.name] ?? "Pendiente",
          eventId: currentEvent.id,
          imageUrl: item?.profile_image_url,
          imageId: item?.profile_image_id,
        }));

        normalized.sort(
          (a, b) =>
            a.fechaInicio.localeCompare(b.fechaInicio) ||
            a.horaInicio.localeCompare(b.horaInicio)
        );

        setOffers(normalized);
      } catch (err) {
        console.error("Error al traer ofertas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [currentEvent, filter]);

  const goNextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex((prev) => prev + 1);
      setFilter("Aceptadas");
    }
  };

  const goPrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex((prev) => prev - 1);
      setFilter("Aceptadas");
    }
  };

  // Crear pago y devolver link (no abre navegador acá)
  const createPaymentLink = async (
    offerId: number
  ): Promise<{ url: string; paymentId?: number }> => {
    setCreatingPaymentId(offerId);
    try {
      // Preferentemente POST; si tu backend expone GET, ajustá aquí
      let data: any = await requestBackend(
        `/api/payments/mercadopago/payments/${offerId}/`,
        null,
        "POST"
      );

      // Fallback a GET si no vino objeto
      if (!data || typeof data !== "object") {
        data = await requestBackend(
          `/api/payments/mercadopago/payments/${offerId}/`,
          null,
          "GET"
        );
      }

      // Soporte para múltiples formados de respuesta
      const url =
        data?.payment_url ||
        data?.init_point ||
        data?.sandbox_init_point ||
        data?.url ||
        data?.redirect_url ||
        data?.link;

      const paymentId = data?.payment_id ?? data?.id;

      if (!url || typeof url !== "string") {
        throw new Error("El backend no devolvió un link de pago válido.");
      }

      return { url, paymentId };
    } finally {
      setCreatingPaymentId(null);
    }
  };

  return {
    currentEvent,
    goNextEvent,
    goPrevEvent,
    canGoNext: currentEventIndex < events.length - 1,
    canGoPrev: currentEventIndex > 0,
    filter,
    setFilter,
    offers,
    filteredOffers: offers,
    events,
    loading,
    loadingEvents,

    // pago
    creatingPaymentId,
    createPaymentLink,
  };
};
