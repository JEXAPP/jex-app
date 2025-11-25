import { useState, useEffect } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type OfferStatus = "Pendiente" | "Aceptada" | "Rechazada" | "Vencida" | "A Pagar";
export type FilterSimple = "Pendiente" | "Aceptadas" | "Otro";
export type PaymentState = "NOT_PAYED" | "APPROVED" | "PENDING" | "FAILURE";

export type EventState = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  name: string;
  state: EventState;
  all_payed: boolean;
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
  payment_state: PaymentState;
};

const backendStateToStatus: Record<string, OfferStatus> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Vencida",
  COMPLETED: "A Pagar",
  Completed: "A Pagar",
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

  const [creatingPaymentId, setCreatingPaymentId] = useState<number | null>(null);

  const currentEvent: Event | null = events[currentEventIndex] ?? null;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await requestBackend("/api/events/by-employer/", null, "GET");
        if (Array.isArray(data)) {
          const filteredRaw = data.filter((e: any) => {
            const stateName = e.state?.name ?? "Publicado";
            if (stateName !== "Finalizado") return true;
            return e.all_payed === false;
          });

          const normalized: Event[] = filteredRaw.map((e: any) => ({
            id: e.id,
            name: e.name,
            state: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Publicado",
            },
            all_payed: Boolean(e.all_payed),
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

  useEffect(() => {
    const fetchOffers = async () => {
      if (!currentEvent) return;
      setLoading(true);
      try {
        const isFinalized = currentEvent.state.name === "Finalizado";

        let stateIds: number[];
        if (isFinalized) {
          stateIds = [6]; // COMPLETED -> "A Pagar"
        } else {
          stateIds = filterToBackendIds[filter];
        }

        const requests = stateIds.map((sid) =>
          requestBackend(
            `/api/applications/offers/${currentEvent.id}/state/${sid}/`,
            null,
            "GET"
          )
        );
        const results = await Promise.all(requests);
        const all = results.flat().filter(Boolean);

        const normalized: Offer[] = all.map((item: any) => {
          const backendName = item?.offer_state?.name;

          const status: OfferStatus = isFinalized
            ? "A Pagar"
            : backendStateToStatus[backendName] ?? "Pendiente";

          return {
            id: item?.id ?? 0,
            employeeName: `${item?.employee_name ?? ""} ${
              item?.employee_lastname ?? ""
            }`.trim(),
            employeeImage: require("@/assets/images/jex/Jex-FotoPerfil.webp"),
            role: item?.job_type ?? "Sin rol",
            salary: new Intl.NumberFormat("es-AR").format(
              item?.shift?.payment ?? 0
            ),
            fechaInicio: item?.shift?.start_date ?? "",
            horaInicio: item?.shift?.start_time ?? "",
            horaFin: item?.shift?.end_time ?? "",
            expiryDate: item?.expiration_date ?? "",
            expiryTime: item?.expiration_time ?? "",
            status,
            eventId: currentEvent.id,
            imageUrl: item?.profile_image,
            imageId: item?.profile_image_id,
            payment_state: (item?.payment_state as PaymentState) ?? "NOT_PAYED",
          };
        });

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

  const createPaymentLink = async (
    offerId: number
  ): Promise<{ url: string; paymentId?: number }> => {
    setCreatingPaymentId(offerId);
    try {
      let data: any = await requestBackend(
        `/api/payments/mercadopago/payments/${offerId}/`,
        null,
        "POST"
      );

      if (!data || typeof data !== "object") {
        data = await requestBackend(
          `/api/payments/mercadopago/payments/${offerId}/`,
          null,
          "GET"
        );
      }

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
    creatingPaymentId,
    createPaymentLink,
  };
};
