// hooks/employer/useVacancies.ts
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

type VacancyState = "Activa" | "En Borrador" | "Oculta" | "Llena" | "Vencida" | "Eliminada";

type VacancyItem = {
  id: number;
  nombre: string;
  estado: string;
  eventId: number;
};

const SELECTABLE_STATES: VacancyState[] = ["Activa", "En Borrador", "Oculta", "Llena", "Vencida"];

export const useVacancies = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requestBackend } = useBackendConection();

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);

  const [selectedState, setSelectedState] = useState<VacancyState | null>(null);
  const [search, setSearch] = useState("");

  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [horaInicioEvento, setHoraInicioEvento] = useState<string | null>(null);
  const [horaFinEvento, setHoraFinEvento] = useState<string | null>(null);

  // Cargar vacantes del evento
  useEffect(() => {
    const fetchVacanciesByEvent = async (eventIdStr: string) => {
      const eventId = Number(eventIdStr);
      if (!eventId) return;
      setLoadingVacancies(true);
      try {
        const data = await requestBackend(`/api/vacancies/by-employer/${eventId}/`, null, "GET");

        if (data && Array.isArray(data.vacancies)) {
          const normalized: VacancyItem[] = data.vacancies.map((v: any) => ({
            id: v.id,
            nombre: v.job_type?.name === "Otro" && v.specific_job_type ? v.specific_job_type : v.job_type?.name ?? v.name,
            estado: v.state?.name ?? "Sin Estado",
            eventId: data.id ?? eventId,
          }));

          setVacancies(normalized);
          setCurrentEvent({
            id: data.id,
            nombre: data.name,
            estado: data.state,
            fechaInicio: data.start_date,
            fechaFin: data.end_date,
            horaInicio: data.start_time,
            horaFin: data.end_time,
            ubicacion: data.location,
          });
          setHoraInicioEvento(data.start_time ?? null);
          setHoraFinEvento(data.end_time ?? null);
        } else {
          setVacancies([]);
          setCurrentEvent(null);
          setHoraInicioEvento(null);
          setHoraFinEvento(null);
        }
      } catch (err) {
        console.log("Error cargando vacantes por evento:", err);
      } finally {
        setLoadingVacancies(false);
      }
    };

    if (id) {
      fetchVacanciesByEvent(id);
    } else {
      setVacancies([]);
      setCurrentEvent(null);
      setHoraInicioEvento(null);
      setHoraFinEvento(null);
    }
  }, []);

  const goToCreateVacancy = (eventId: number, fechaInicio: string, fechaFin: string, horaInicio: string, horaFin: string) =>
    router.push(
      `/employer/panel/vacancy/create-vacancy?id=${eventId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&horaInicio=${horaInicio}&horaFin=${horaFin}`
    );

  const goToVacancyDetail = (vacancyId: number) =>
    router.push(`/employer/panel/vacancy/manipulate-vacancy?id=${vacancyId}`);

  const filteredVacantes = useMemo(() => {
    const q = search.toLowerCase();
    return vacancies
      .filter(v => v.nombre.toLowerCase().includes(q))
      .filter(v => (selectedState ? v.estado === selectedState : true))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [vacancies, search, selectedState]);

  return {
    // estado
    loading: loadingVacancies,
    filteredVacantes,
    search,
    setSearch,
    selectableStates: SELECTABLE_STATES,
    selectedState,
    setSelectedState,
    // navegación
    goToCreateVacancy,
    goToVacancyDetail,
    // evento actual + horarios
    currentEvent,
    horaInicioEvento,
    horaFinEvento,
  };
};
export default useVacancies;
