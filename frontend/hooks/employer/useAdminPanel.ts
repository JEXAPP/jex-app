import useBackendConection from "@/services/internal/useBackendConection";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

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

  // NUEVO: estado de nuevas notificaciones
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

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

  // NUEVO: consultar si hay nuevas notificaciones
  const fetchHasNewNotifications = async () => {
    try {
      const response = await requestBackend(
        "/api/notifications/are-new-notifications/",
        null,
        "GET"
      );
      if (typeof response?.message === "boolean") {
        setHasNewNotifications(response.message);
      }
    } catch (err) {
      console.log("Error consultando nuevas notificaciones:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      fetchHasNewNotifications(); // refrescar cada vez que la pantalla gana foco
    }, [])
  );

  useEffect(() => {
    fetchEvents();
    fetchHasNewNotifications();
  }, []); // solo en montaje

  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aT = a.fechaISO ? new Date(a.fechaISO).getTime() : 0;
      const bT = b.fechaISO ? new Date(b.fechaISO).getTime() : 0;
      return aT - bT;
    });
  }, [events]);

  const currentEvent = orderedEvents[currentEventIndex];

  const enabledLabelsByState: Record<string, string[]> = {
    Borrador: ["Vacantes", "Editar Evento"],
    Publicado: ["Vacantes", "Contratación Tardía"],
    "En curso": ["Asistencia"],
    Finalizado: ["Calificaciones", "Reportes"],
  };

  const getOrderedButtons = (buttons: any[]) => {
    const enabledLabels = enabledLabelsByState[currentEvent?.estado?.name] ?? [];

    const enabled = buttons
      .filter((btn) => enabledLabels.includes(btn.label))
      .sort((a, b) => a.label.localeCompare(b.label));

    const disabled = buttons
      .filter((btn) => !enabledLabels.includes(btn.label))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [...enabled, ...disabled];
  };

  const handleNextEvent = () => {
    if (currentEventIndex < orderedEvents.length - 1)
      setCurrentEventIndex((i) => i + 1);
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex((i) => i - 1);
  };

  const goToCreateEvent = () => router.push("/employer/panel/create-event");

  const goToEditEvent = (id: number) =>
    router.push(`/employer/panel/edit-event?id=${id}`);

  const goToVacancies = (eventId: number) => {
    const idx = orderedEvents.findIndex((e) => e.id === eventId);
    if (idx >= 0) setCurrentEventIndex(idx);
    router.push({
      pathname: "/employer/panel/vacancy",
      params: { id: String(eventId) },
    });
  };

  // NUEVO: al entrar a notificaciones, apagamos el puntito
  const goToNotifications = () => {
    setHasNewNotifications(false);
    router.push("/employer/panel/notifications");
  };

  const goToReports = (id: number) => {
    router.push({ pathname: "/employer/panel/report", params: { id: String(id) } });
  };

  const goToAttendance = (id: number) =>
    router.push(`/employer/panel/attendance?id=${id}`);

  const goToQualifications = (eventId: number) =>
    router.push({
      pathname: "/employer/panel/qualification",
      params: { eventId: String(eventId) },
    });

  return {
    loading,
    events: orderedEvents,
    currentEvent,
    currentEventIndex,
    setCurrentEventIndex,
    handleNextEvent,
    handlePrevEvent,
    goToCreateEvent,
    goToEditEvent,
    refreshEvents: fetchEvents,
    getOrderedButtons,
    goToVacancies,
    goToAttendance,
    goToNotifications,
    goToQualifications,
    goToReports,
    hasNewNotifications, // NUEVO
  };
};

export default useAdminPanel;