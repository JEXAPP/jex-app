// hooks/employer/useAdminPanel.ts
import useBackendConection from "@/services/internal/useBackendConection";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

type EventItem = {
  id: number;
  nombre: string;
  estado: { id: number; name: string };
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

  const mapEvent = (e: any): EventItem => ({
    id: e.id,
    nombre: e.name,
    estado: { id: e.state?.id ?? 0, name: e.state?.name ?? "Sin Estado" },
    fechaInicio: e.start_date ?? "",
    fechaFin: e.end_date ?? "",
    fechaISO: e.start_date ?? "",
    horaInicio: e.start_time ?? "",
    horaFin: e.end_time ?? "",
    ubicacion: e.location ?? "",
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await requestBackend("/api/events/by-employer/", null, "GET");
      if (Array.isArray(data)) setEvents(data.map(mapEvent));
    } catch (err) {
      console.log("Error cargando eventos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []); // solo en mount

  const refreshEvents = () =>
    requestBackend("/api/events/by-employer/", null, "GET")
      .then((data) => { if (Array.isArray(data)) setEvents(data.map(mapEvent)); })
      .catch((err) => console.log("Error refrescando eventos:", err));

  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aT = a.fechaISO ? new Date(a.fechaISO).getTime() : 0;
      const bT = b.fechaISO ? new Date(b.fechaISO).getTime() : 0;
      return aT - bT;
    });
  }, [events]);

  const currentEvent = orderedEvents[currentEventIndex];

  const handleNextEvent = () => {
    if (currentEventIndex < orderedEvents.length - 1) setCurrentEventIndex(i => i + 1);
  };
  const handlePrevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1);
  };

  const goToCreateEvent = () => router.push("/employer/panel/create-event");
  const goToEditEvent = (id: number) => router.push(`/employer/panel/edit-event?id=${id}`);

  const goToVacancies = (eventId: number) => {
    const idx = orderedEvents.findIndex(e => e.id === eventId);
    if (idx >= 0) setCurrentEventIndex(idx);
    router.push({ pathname: "/employer/panel/vacancy", params: { id: String(eventId) } });
  };

  const goToAttendance = (id: number) => router.push(`/employer/panel/attendance?id=${id}`);
  const goToQualifications = () => router.push("/employer/panel/qualification");

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
    goToAttendance,
    goToQualifications,
  };
};
export default useAdminPanel;
