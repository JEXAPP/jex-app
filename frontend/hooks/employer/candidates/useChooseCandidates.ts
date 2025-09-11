import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import useBackendConection from '@/services/internal/useBackendConection';

// ===== API =====
export type VacancyAPI = {
  vacancy_id: number;
  job_type_name: string;
  specific_job_type: string | null;
  quantity_shifts: number;
  shift_ids: number[];
};

export type EventWithVacanciesAPI = {
  event_name: string;
  vacancies: VacancyAPI[];
};

export type EventsVacanciesAPI = EventWithVacanciesAPI[];

export type ApplicantAPI = {
  application_id: number;
  created_at: string;
  employee_id: number;
  full_name: string;
  profile_image: string | null;
};

export type ApplicationsByShiftAPI = {
  shift_id: number;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  applications: ApplicantAPI[];
};

// ===== UI domain =====
export type Vacancy = {
  id: number;
  roleName: string;      // job_type_name (+ specific)
  shiftIds: number[];
};

export type EventItem = {
  id: string;            // generado por índice
  name: string;
  vacancies: Vacancy[];
};

export type Candidate = {
  id: number;            // application_id
  employeeId: number;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
  shiftId: number;       // turno al que corresponde
};

type ShiftInfo = {
  shiftId: number;
  startDate: string; // "DD/MM/YYYY"
  endDate: string;   // "
  startTime: string; // "HH:mm"
  endTime: string;   // "
};

const ENDPOINTS = {
  eventsVacancies: '/api/events/vacancies/',
  applicationsByVacancyShift: (vacancyId: number, shiftId: number) =>
    `/api/applications/by-vacancy/${vacancyId}/shift/${shiftId}`,
};

export const useChooseCandidates = () => {
  const { requestBackend } = useBackendConection();

  // --- UI refs ---
  const roleAnchorRef = useRef<View | null>(null);

  // --- Estado principal ---
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent: EventItem | null = useMemo(
    () => (events.length ? events[Math.min(currentEventIndex, events.length - 1)] : null),
    [events, currentEventIndex]
  );

  const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);
  const currentVacancy = useMemo(
    () => currentEvent?.vacancies.find(v => v.id === selectedVacancyId) ?? null,
    [currentEvent, selectedVacancyId]
  );

  // IMPORTANTE: ya no existe “Todos”. Siempre hay turno seleccionado.
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // estados UI
  const [loadingEventVacancies, setLoadingEventVacancies] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rolePickerVisible, setRolePickerVisible] = useState(false);
  const [shiftInfo, setShiftInfo] = useState<ShiftInfo | null>(null);

  // Derivados
  const eventName = currentEvent?.name ?? '';
  const roleOptions = useMemo(
    () =>
      (currentEvent?.vacancies ?? []).map(v => ({
        label: v.roleName,
        value: v.id,
      })),
    [currentEvent]
  );


  const selectedRoleLabel = useMemo(() => {
    const opt = roleOptions.find(o => o.value === selectedVacancyId);
    return opt?.label ?? 'Seleccionar rol';
  }, [roleOptions, selectedVacancyId]);

  const shiftTags = useMemo(() => {
    const ids = currentVacancy?.shiftIds ?? [];
    return ids.map((id, idx) => ({ id, name: `Turno ${idx + 1}` }));
  }, [currentVacancy?.shiftIds]);

  // ===== Requests =====
  const fetchAllEventsVacancies = async () => {
    setLoadingEventVacancies(true);
    setError(null);
    try {
      const data: EventsVacanciesAPI = await requestBackend('/api/events/vacancies/', null, 'GET');
      
      const mapped: EventItem[] = data.map((e, idx) => ({
        id: `evt_${idx}`,
        name: e.event_name,
        vacancies: (e.vacancies || []).map(v => ({
          id: v.vacancy_id,
          roleName: v.specific_job_type
            ? `${v.job_type_name} · ${v.specific_job_type}`
            : v.job_type_name,
          shiftIds: v.shift_ids || [],
        })),
      }));

      setEvents(mapped);

      // Default: primer evento con vacantes y su primera vacante + primer turno
      const firstEventWithVac = mapped.findIndex(ev => (ev.vacancies?.length ?? 0) > 0);
      if (firstEventWithVac >= 0) {
        setCurrentEventIndex(firstEventWithVac);
        const firstVacId = mapped[firstEventWithVac].vacancies[0].id;
        setSelectedVacancyId(firstVacId);
        const firstShift = mapped[firstEventWithVac].vacancies[0].shiftIds[0] ?? null;
        setSelectedShiftId(firstShift);
      } else {
        // No hay vacantes en ningún evento
        setCurrentEventIndex(0);
        setSelectedVacancyId(null);
        setSelectedShiftId(null);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar eventos y vacantes');
      setEvents([]);
      setSelectedVacancyId(null);
      setSelectedShiftId(null);
    } finally {
      setLoadingEventVacancies(false);
    }
  };

  const fetchApplications = async (vacancyId: number | null, shiftId: number | null) => {
    // Siempre requiere turno; si cambia, vaciamos vista ANTES
    if (!vacancyId || !shiftId) {
      setCandidates([]);
      setShiftInfo(null);
      return;
    }
    setLoadingApplications(true);
    setError(null);
    try {
      // OJO: tu requestBackend devuelve { data }, no el body directo, ajusto:
      const data: ApplicationsByShiftAPI = await requestBackend(
        ENDPOINTS.applicationsByVacancyShift(vacancyId, shiftId),
        'GET'
      );

      // Guardamos horario del turno
      setShiftInfo({
        shiftId: data.shift_id,
        startDate: data.start_date,
        endDate: data.end_date,
        startTime: data.start_time,
        endTime: data.end_time,
      });

      const items: Candidate[] = (data.applications || []).map(a => ({
        id: a.application_id,
        employeeId: a.employee_id,
        fullName: a.full_name,
        avatarUrl: a.profile_image,
        createdAt: a.created_at,
        shiftId: data.shift_id,
      })).sort((a, b) => a.fullName.localeCompare(b.fullName));

      setCandidates(items);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar postulaciones');
      setCandidates([]);
      setShiftInfo(null);
    } finally {
      setLoadingApplications(false);
    }
  };

  // ===== Efectos =====
  useEffect(() => { fetchAllEventsVacancies(); }, []);

  // Al cambiar de evento: setear primera vacante y su primer turno
  useEffect(() => {
    if (!currentEvent) return;
    if ((currentEvent.vacancies?.length ?? 0) === 0) {
      setSelectedVacancyId(null);
      setSelectedShiftId(null);
      return;
    }
    const firstVacId = currentEvent.vacancies[0].id;
    const firstShiftId = currentEvent.vacancies[0].shiftIds[0] ?? null;
    setSelectedVacancyId(firstVacId);
    setSelectedShiftId(firstShiftId);
  }, [currentEventIndex, currentEvent?.id]);

  // Al cambiar vacante: setear su primer turno
  useEffect(() => {
    if (!currentVacancy) {
      setSelectedShiftId(null);
      setCandidates([]);   // limpia grilla
      setShiftInfo(null);  // limpia horario
      return;
    }
    const firstShiftId = currentVacancy.shiftIds[0] ?? null;
    setSelectedShiftId(firstShiftId);
    setCandidates([]);     // limpia mientras cambia
    setShiftInfo(null);
  }, [selectedVacancyId]);

  // Traer postulaciones cuando hay vacante y turno seleccionados
  useEffect(() => {
    fetchApplications(selectedVacancyId, selectedShiftId);
  }, [selectedVacancyId, selectedShiftId]);

  // ===== Handlers =====
  const handlePrevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1);
  };
  const handleNextEvent = () => {
    if (currentEventIndex < events.length - 1) setCurrentEventIndex(i => i + 1);
  };
  const handleSelectVacancy = (vacancyId: number) => {
    setSelectedVacancyId(vacancyId);
    // el efecto de arriba setea automáticamente el primer turno
  };
  const handleSelectShift = (shiftId: number) => {
    setSelectedShiftId(shiftId);
    setCandidates([]);     // limpia inmediatamente al tocar otro turno
    setShiftInfo(null);
  };

  // Empty states
  const hasNoEvents = !loadingEventVacancies && events.length === 0;
  const hasEventsButNoVacanciesGlobal =
    !loadingEventVacancies && events.length > 0 && events.every(ev => (ev.vacancies?.length ?? 0) === 0);
  const currentEventHasNoVacancies =
    !!currentEvent && (currentEvent.vacancies?.length ?? 0) === 0;
  const hasVacanciesButNoCandidates =
    !loadingApplications && !loadingEventVacancies && !!currentVacancy && candidates.length === 0;

  const goToCandidateDetail = (candidateId: number) => {
    // Ajustá la ruta a tu estructura
    //router.push(`/employer/candidate/${candidateId}`);
  };

  const splitFirstSpace = (s: string) => {
    const i = s.indexOf(' ');
    return i >= 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, ''];
  };

  return {
    // data
    eventName,
    currentEventIndex,
    vacancies: currentEvent?.vacancies ?? [],
    roleOptions,
    shiftInfo,
    roleAnchorRef,
    selectedVacancyId,
    currentVacancy,
    selectedShiftId,
    candidates,
    selectedRoleLabel,
    shiftTags,
    rolePickerVisible,
    setRolePickerVisible,
    splitFirstSpace,

    // states
    loadingEventVacancies,
    loadingApplications,
    error,

    // empty flags
    hasNoEvents,
    hasEventsButNoVacanciesGlobal,
    currentEventHasNoVacancies,
    hasVacanciesButNoCandidates,

    // actions
    handlePrevEvent,
    handleNextEvent,
    handleSelectVacancy,
    handleSelectShift,

    goToCandidateDetail
  };
};
