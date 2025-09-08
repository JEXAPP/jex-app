import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

type EventItem = {
  id: number;
  nombre: string;
  estado: {
    id: number;
    name: string;
  };
};

type VacancyItem = {
  id: number;
  nombre: string;
  estado: string;
};

export const useAdminPanel = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Estado para vacantes
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);

  // 🚀 Cargar eventos
  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await requestBackend("/api/events/by-employer/", null, "GET");
        if (!mounted) return;

        if (Array.isArray(data)) {
          const normalized: EventItem[] = data.map((e: any) => ({
            id: e.id,
            nombre: e.name,
            estado: {
              id: e.state?.id ?? 0,
              name: e.state?.name ?? "Sin Estado",
            },
          }));

          setEvents(normalized);
        }
      } catch (e) {
        console.log("Error cargando eventos:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  // Evento actual
  const currentEvent = useMemo(
    () => events[currentEventIndex],
    [events, currentEventIndex]
  );

  // 🚀 Cargar vacantes del evento seleccionado
  const fetchVacanciesByEvent = async (eventId: number) => {
    setLoadingVacancies(true);
    try {
      const data = await requestBackend("/api/vacancies/by-employer/", null, "GET");

      if (Array.isArray(data)) {
        const filtered = data.filter((v: any) => v.event?.id === eventId);

        const normalized: VacancyItem[] = filtered.map((v: any) => ({
          id: v.id,
          nombre: v.name,
          estado: v.state?.name ?? "Sin Estado",
        }));

        setVacancies(normalized);
      }
    } catch (e) {
      console.error("Error cargando vacantes:", e);
    } finally {
      setLoadingVacancies(false);
    }
  };

  // Navegaciones
  const handleNextEvent = () => {
    if (currentEventIndex < events.length - 1) {
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

  // 🚀 Ahora podemos usar esta función para traer vacantes del evento actual
  const goToVacancies = async (eventId: number) => {
    await fetchVacanciesByEvent(eventId);

    router.push({
      pathname: "/employer/vacancy",
      params: { id: String(eventId) },
    });
  };

  return {
    // Eventos
    loading,
    events,
    currentEvent,
    currentEventIndex,
    handleNextEvent,
    handlePrevEvent,
    goToCreateEvent,
    goToEditEvent,

    // Vacantes
    loadingVacancies,
    vacancies,
    fetchVacanciesByEvent,

    // Navegación
    goToVacancies,
  };
};
