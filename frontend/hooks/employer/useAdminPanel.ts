// hooks/employer/useAdminPanel.ts
import useBackendConection from "@/services/internal/useBackendConection";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

type EventItem = {
  id: number;
  nombre: string;
  estado: {
    id: number;
    name: string;
  };
  fechaInicio: string;
  fechaFin: string;
  fechaISO: string;
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
};


export const useAdminPanel = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // 🚀 Cargar eventos — SOLO al montar (no depende de events.length)
  // hooks/employer/useAdminPanel.ts
useEffect(() => {
  let mounted = true;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await requestBackend("/api/events/by-employer/", null, "GET");
      if (!mounted) return;

      if (Array.isArray(data)) {
        setEvents(
          data.map((e: any) => ({
            id: e.id,
            nombre: e.name,
            estado: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Sin Estado",
            },
            fechaInicio: e.start_date ?? "",
            fechaFin: e.end_date ?? "",
            fechaISO: e.start_date ?? "",
            horaInicio: e.start_time ?? "",
            horaFin: e.end_time ?? "",
            ubicacion: e.location ?? "",
          }))
        );

      }
    } catch (err) {
      console.log("Error cargando eventos:", err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  fetchEvents();

  return () => {
    mounted = false;
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // 👈 corre solo en mount


  const refreshEvents = () => {
  // fuerza el fetch otra vez
  return requestBackend("/api/events/by-employer/", null, "GET")
    .then((data) => {
      if (Array.isArray(data)) {
        setEvents(
          data.map((e: any) => ({
            id: e.id,
            nombre: e.name,
            estado: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Sin Estado",
            },
            fechaInicio: e.start_date ?? "",
            fechaFin: e.end_date ?? "",
            fechaISO: e.start_date ?? "",
            horaInicio: e.start_time ?? "",
            horaFin: e.end_time ?? "",
            ubicacion: e.location ?? "",
          }))
        );

      }
    })
    .catch((err) => console.log("Error refrescando eventos:", err));
};

  // 🚀 Eventos ordenados
  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const fechaA = a.fechaISO ? new Date(a.fechaISO).getTime() : 0;
      const fechaB = b.fechaISO ? new Date(b.fechaISO).getTime() : 0;
      return fechaA - fechaB;
    });
  }, [events]);

  // Evento actual
  const currentEvent = orderedEvents[currentEventIndex];

  // Navegaciones
  const handleNextEvent = () => {
    if (currentEventIndex < orderedEvents.length - 1) {
      setCurrentEventIndex((i) => i + 1);
    }
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex((i) => i - 1);
    }
  };

  const goToCreateEvent = () => router.push("/employer/vacancy/create-event");
  const goToEditEvent = (id: number) =>
    router.push(`/employer/vacancy/edit-event?id=${id}`);

  const goToVacancies = (eventId: number) => {
    const idx = orderedEvents.findIndex((e) => e.id === eventId);
    if (idx >= 0) {
      setCurrentEventIndex(idx);
    }
    router.push({
      pathname: "/employer/vacancy",
      params: { id: String(eventId) },
    });
  };

  return {
    // Eventos
    loading,
    events: orderedEvents,
    currentEvent,
    currentEventIndex,
    setCurrentEventIndex,
    handleNextEvent,
    handlePrevEvent,
    goToCreateEvent,
    goToEditEvent,
    refreshEvents,

    // Navegación
    goToVacancies,
  };
};
export default useAdminPanel;
