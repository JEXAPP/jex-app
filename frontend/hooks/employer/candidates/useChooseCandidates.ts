import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

export type VacancyAPI = {
  vacancy_id: number;
  job_type_name: string;
  specific_job_type: string | null;
  quantity_shifts: number;
  shift_ids: number[];
};

export type VacanciesByEventAPI = {
  event_name: string;
  vacancies: VacancyAPI[];
};

export type ApplicantAPI = {
  application_id: number;
  created_at: string;              // "22/08/2025"
  employee_id: number;
  full_name: string;
  profile_image: string | null;
};

export type ApplicationsByShiftAPI = {
  shift_id: number;
  start_time: string;              // "14:00"
  end_time: string;                // "19:00"
  start_date: string;              // "05/09/2025"
  end_date: string;                // "07/09/2025"
  applications: ApplicantAPI[];
};

// ===== UI domain =====
export type Vacancy = {
  id: number;
  roleName: string;        // job_type_name + (specific_job_type)
  shiftIds: number[];
};

export type Candidate = {
  id: number;              // application_id
  employeeId: number;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
  shiftId: number;         // de qué turno es esta postulación
};

const ENDPOINTS = {
  vacanciesByEvent: (eventId: number) => `/api/events/${eventId}/vacancies`,
  applicationsByVacancyShift: (vacancyId: number, shiftId: number) =>
    `/api/applications/by-vacancy/${vacancyId}/shift/${shiftId}`,
};

export const useChooseCandidates = () => {
  const { requestBackend } = useBackendConection();

  // --- UI refs ---
  const roleAnchorRef = useRef<View | null>(null);

  // --- Estado de navegación/selección ---
  const [eventIds, setEventIds] = useState<number[]>([]); // lista de eventos del usuario (si la tenés de otra pantalla, podés inyectarla)
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEventId = eventIds[currentEventIndex] ?? null;

  // datos del evento actual
  const [eventName, setEventName] = useState<string>(''); // título
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);

  // turnos
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null); // null = todos

  // postulaciones
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // estados
  const [loadingEventVacancies, setLoadingEventVacancies] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opciones del dropdown de roles
  const roleOptions = useMemo(
    () =>
      vacancies.map(v => ({
        label: v.roleName,
        value: v.id,
      })),
    [vacancies]
  );

  const currentVacancy = useMemo(
    () => vacancies.find(v => v.id === selectedVacancyId) || null,
    [vacancies, selectedVacancyId]
  );

  // ========= Requests =========

  /** Cargar vacantes del evento actual */
  const fetchVacanciesByEvent = async (eventId: number) => {
    setLoadingEventVacancies(true);
    setError(null);
    try {
      const resp = await requestBackend(ENDPOINTS.vacanciesByEvent(eventId), 'GET');
      const data: VacanciesByEventAPI = resp.data;

      setEventName(data.event_name);

      const mapped: Vacancy[] = data.vacancies.map(v => ({
        id: v.vacancy_id,
        roleName: v.specific_job_type
          ? `${v.job_type_name} · ${v.specific_job_type}`
          : v.job_type_name,
        shiftIds: v.shift_ids || [],
      }));

      setVacancies(mapped);
      setSelectedVacancyId(mapped[0]?.id ?? null);
      setSelectedShiftId(null); // por defecto “Todos”
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar vacantes del evento');
      setVacancies([]);
      setSelectedVacancyId(null);
    } finally {
      setLoadingEventVacancies(false);
    }
  };

  /** Cargar postulaciones: si shiftId es null, trae todas las de los shift_ids de la vacante y mergea */
  const fetchApplications = async (vacancyId: number | null, shiftId: number | null) => {
    if (!vacancyId) {
      setCandidates([]);
      return;
    }
    const vacancy = vacancies.find(v => v.id === vacancyId);
    if (!vacancy) {
      setCandidates([]);
      return;
    }

    setLoadingApplications(true);
    setError(null);

    try {
      const targetShiftIds = shiftId == null ? vacancy.shiftIds : [shiftId];

      const requests = targetShiftIds.map(async sid => {
        const r = await requestBackend(ENDPOINTS.applicationsByVacancyShift(vacancyId, sid), 'GET');
        const data: ApplicationsByShiftAPI = r.data;
        const mapped: Candidate[] = (data.applications || []).map(a => ({
          id: a.application_id,
          employeeId: a.employee_id,
          fullName: a.full_name,
          avatarUrl: a.profile_image,
          createdAt: a.created_at,
          shiftId: data.shift_id,
        }));
        return mapped;
      });

      const chunks = await Promise.all(requests);
      // flat + ordenar por fecha de creación (opcional)
      const all = chunks.flat().sort((a, b) => a.fullName.localeCompare(b.fullName));
      setCandidates(all);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar postulaciones');
      setCandidates([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // ========= Efectos =========

  // Este arreglo de eventIds podés setearlo desde props, contexto, o precargarlo aquí.
  // Para ejemplo: simulamos que ya tenemos 3 eventos [1,2,3]
  useEffect(() => {
    // Si ya venís con los IDs de otra pantalla, reemplazá esta línea:
    setEventIds(prev => (prev.length ? prev : [1, 2, 3]));
  }, []);

  // al cambiar de evento
  useEffect(() => {
    if (currentEventId != null) {
      fetchVacanciesByEvent(currentEventId);
    }
  }, [currentEventId]);

  // al cambiar vacante o shift => traer postulaciones
  useEffect(() => {
    fetchApplications(selectedVacancyId, selectedShiftId);
  }, [selectedVacancyId, selectedShiftId]);

  // ========= Handlers UI =========

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1);
  };
  const handleNextEvent = () => {
    if (currentEventIndex < eventIds.length - 1) setCurrentEventIndex(i => i + 1);
  };

  const handleSelectVacancy = (vacancyId: number) => {
    setSelectedVacancyId(vacancyId);
    setSelectedShiftId(null); // al cambiar vacante, volvemos a “Todos”
  };

  const handleSelectShift = (shiftId: number | null) => {
    setSelectedShiftId(shiftId); // null = “Todos”
  };

  const goToCandidateDetail = (candidateId: number) => {
    //router.push(`/employer/candidates/detail?id=${candidateId}`);
  };

  return {
    // data
    eventName,
    currentEventIndex,
    vacancies,
    roleOptions,
    roleAnchorRef,
    selectedVacancyId,
    currentVacancy,
    selectedShiftId,
    candidates,

    // states
    loadingEventVacancies,
    loadingApplications,
    error,

    // actions
    handlePrevEvent,
    handleNextEvent,
    handleSelectVacancy,
    handleSelectShift,
    goToCandidateDetail,
  };
};
