import { useState, useEffect } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type OfferStatus = "Pendiente" | "Aceptada" | "Rechazada" | "Vencida";
export type FilterStatus = "Pendientes" | "Aceptadas" | "Rechazadas" | "Vencidas";

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
  salary: string;        // ya viene formateado con Intl.NumberFormat
  fechaInicio: string;   // dd/MM/yyyy
  horaInicio: string;    // HH:mm
  horaFin: string;       // HH:mm
  expiryDate: string;    // dd/MM/yyyy
  expiryTime: string;    // HH:mm
  status: OfferStatus;
  eventId: number;
};

const filterStatusToBackendId: Record<FilterStatus, number> = {
  Pendientes: 1,
  Aceptadas: 2,
  Rechazadas: 3,
  Vencidas: 5,
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

export const useStateOffers = () => {
  const { requestBackend } = useBackendConection();

  const [events, setEvents] = useState<Event[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [filter, setFilter] = useState<FilterStatus>("Pendientes");
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const currentEvent: Event | null = events[currentEventIndex] ?? null;

  // 🔹 Traer eventos al montar
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

  // 🔹 Traer ofertas cada vez que cambia el evento actual o el filtro
  useEffect(() => {
    const fetchOffers = async () => {
      if (!currentEvent) return;
      setLoading(true);
      try {
        const stateId = filterStatusToBackendId[filter];
        const url = `/api/applications/offers/${currentEvent.id}/state/${stateId}/`;
        const data = await requestBackend(url, null, "GET");

        if (Array.isArray(data)) {
          const normalized: Offer[] = data.map((item: any) => ({
            id: item?.id ?? 0,
            employeeName: `${item?.employee_name ?? ""} ${item?.employee_lastname ?? ""}`.trim(),
            employeeImage: require("@/assets/images/jex/Jex-FotoPerfil.png"), // fallback por ahora
            role: item?.job_type ?? "Sin rol",
            salary: new Intl.NumberFormat("es-AR").format(item?.shift?.payment ?? 0),
            fechaInicio: item?.shift?.start_date ?? "",
            horaInicio: item?.shift?.start_time ?? "",
            horaFin: item?.shift?.end_time ?? "",
            expiryDate: item?.expiration_date ?? "",
            expiryTime: item?.expiration_time ?? "",
            status: backendStateToStatus[item?.offer_state?.name] ?? "Pendiente",
            eventId: currentEvent.id,
          }));
          setOffers(normalized);
        }
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
      setFilter("Pendientes");
    }
  };

  const goPrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex((prev) => prev - 1);
      setFilter("Pendientes");
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
    filteredOffers: offers, // sigue igual para el index
    events,
    loading,
    loadingEvents
  };
};
