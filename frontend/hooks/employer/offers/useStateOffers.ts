import { useState, useEffect } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type OfferStatus = "Pendiente" | "Aceptada" | "Rechazada" | "Vencida";

// 🔹 Nuevo filtro simple
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

// orden de prioridad de estados de evento
const eventStateOrder: Record<string, number> = {
  "En progreso": 1,
  "Publicado": 2,
  "Finalizado": 3,
};

// 🔹 Mapeo nuevo: "Otro" = [Rechazadas (3), Vencidas (5)]
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
  const [filter, setFilter] = useState<FilterSimple>("Pendiente");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const currentEvent: Event | null = events[currentEventIndex] ?? null;

  // Traer eventos
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await requestBackend("/api/events/by-employer/", null, "GET");
        if (Array.isArray(data)) {
          const normalized = data.map((e: any) => ({
            id: e.id,
            name: e.name,
            state: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Publicado",
            },
          }));

          normalized.sort((a: Event, b: Event) => {
            const stateA = eventStateOrder[a.state.name] ?? 99;
            const stateB = eventStateOrder[b.state.name] ?? 99;
            if (stateA !== stateB) return stateA - stateB;
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

  // Traer ofertas por evento + filtro (1, 2 o [3,5])
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
          employeeImage: require("@/assets/images/jex/Jex-FotoPerfil.png"),
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
          imageId: item?.profile_image_id
        }));

        // opcional: ordená por fecha/hora asc
        normalized.sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio) || a.horaInicio.localeCompare(b.horaInicio));

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
      setFilter("Pendiente");
    }
  };

  const goPrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex((prev) => prev - 1);
      setFilter("Pendiente");
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
    filteredOffers: offers, // ya viene filtrado por el backend (y combinado si es "Otro")
    events,
    loading,
    loadingEvents
  };
};
