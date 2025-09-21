// hooks/employer/candidates/useChooseCandidates.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';

// ===== API types =====
type VacancyAPI = {
  vacancy_id: number;
  job_type_name: string;
  specific_job_type: string | null;
  quantity_shifts: number;
  shift_ids: number[];
  quantity?: number;
  quantity_offers?: number;
};

type EventWithVacanciesAPI = {
  event_name: string;
  vacancies: VacancyAPI[];
};

type ApplicantAPI = {
  application_id: number;
  created_at: string;
  employee_id: number;
  full_name: string;
  profile_image: string | null;
};

// Datos por turno
type ApplicationsByShiftAPI = {
  shift_id: number;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;
  applications: ApplicantAPI[];
  quantity?: number;
  quantity_offers?: number;
};

// ===== UI domain =====
type VacancySummary = {
  id: number;
  roleName: string;
  shiftIds: number[];
  quantity?: number;
  quantityOffers?: number;
};

type Candidate = {
  id: number;
  employeeId: number;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
  shiftId: number;
};

type ShiftInfo = {
  shiftId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

const ENDPOINTS = {
  eventsVacancies: '/api/events/vacancies/',
  applicationsByVacancyShift: (vacancyId: number, shiftId: number) =>
    `/api/applications/by-vacancy/${vacancyId}/shift/${shiftId}/`,
};

// ===== Helpers =====
const mapVacancy = (v: VacancyAPI): VacancySummary => ({
  id: v.vacancy_id,
  roleName: v.specific_job_type ? `${v.job_type_name} · ${v.specific_job_type}` : v.job_type_name,
  shiftIds: v.shift_ids ?? [],
  quantity: v.quantity,
  quantityOffers: v.quantity_offers,
});

const splitFirstSpace = (s: string) => {
  const i = s.indexOf(' ');
  return i >= 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, ''];
};

export const useChooseCandidates = () => {
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  // Refs de UI
  const roleAnchorRef = useRef<View | null>(null);

  // Estado principal
  const [events, setEvents] = useState<{ id: string; name: string; vacancies: VacancySummary[] }[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = events.length ? events[Math.min(currentEventIndex, events.length - 1)] : null;

  const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);
  const currentVacancy = useMemo(
    () => currentEvent?.vacancies.find(v => v.id === selectedVacancyId) ?? null,
    [currentEvent, selectedVacancyId]
  );

  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [shiftInfo, setShiftInfo] = useState<ShiftInfo | null>(null);

  // Ofertas por turno (hechas/máximas)
  const [offers, setOffers] = useState<{ made: number; max: number } | null>(null);

  // UI states
  const [rolePickerVisible, setRolePickerVisible] = useState(false);
  const [loadingEventVacancies, setLoadingEventVacancies] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derivados para render
  const eventName = currentEvent?.name ?? '';
  const roleOptions = useMemo(
    () => (currentEvent?.vacancies ?? []).map(v => ({ label: v.roleName, value: v.id })),
    [currentEvent]
  );
  const selectedRoleLabel = useMemo(
    () => roleOptions.find(o => o.value === selectedVacancyId)?.label ?? 'Seleccionar rol',
    [roleOptions, selectedVacancyId]
  );
  const shiftTags = useMemo(
    () => (currentVacancy?.shiftIds ?? []).map((id, idx) => ({ id, name: `Turno ${idx + 1}` })),
    [currentVacancy?.shiftIds]
  );

  const offersMade = offers?.made ?? null; // null mientras carga
  const offersMax = offers?.max ?? null;
  const isFull = offers ? offers.max > 0 && offers.made >= offers.max : false;

  // ===== Requests =====

  // Carga eventos y vacantes, y setea selecciones iniciales
  const fetchAllEventsVacancies = async () => {
    setLoadingEventVacancies(true);
    setError(null);
    try {
      const data: EventWithVacanciesAPI[] = await requestBackend(ENDPOINTS.eventsVacancies, null, 'GET');

      const mapped = data.map((e, idx) => ({
        id: `evt_${idx}`,
        name: e.event_name,
        vacancies: (e.vacancies || []).map(mapVacancy),
      }));

      setEvents(mapped);

      const firstEventWithVac = mapped.findIndex(ev => (ev.vacancies?.length ?? 0) > 0);
      if (firstEventWithVac >= 0) {
        setCurrentEventIndex(firstEventWithVac);
        const firstVac = mapped[firstEventWithVac].vacancies[0];
        setSelectedVacancyId(firstVac?.id ?? null);
        setSelectedShiftId(firstVac?.shiftIds[0] ?? null);
      } else {
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

  // Trae postulaciones + horario + cupos/ofertas del turno seleccionado
  const fetchApplications = async (vacancyId: number | null, shiftId: number | null) => {
    if (!vacancyId || !shiftId) {
      setCandidates([]);
      setShiftInfo(null);
      setOffers(null);
      return;
    }
    setLoadingApplications(true);
    setError(null);
    try {
      const data: ApplicationsByShiftAPI = await requestBackend(
        ENDPOINTS.applicationsByVacancyShift(vacancyId, shiftId),
        null,
        'GET'
      );

      // Horario por turno
      setShiftInfo({
        shiftId: data.shift_id,
        startDate: data.start_date,
        endDate: data.end_date,
        startTime: data.start_time,
        endTime: data.end_time,
      });

      // Ofertas por turno (prefiere valores del turno, con fallback de la vacante)
      const madeFromShift = typeof data.quantity_offers === 'number' ? data.quantity_offers : undefined;
      const maxFromShift = typeof data.quantity === 'number' ? data.quantity : undefined;

      const madeFallback = typeof currentVacancy?.quantityOffers === 'number' ? currentVacancy?.quantityOffers : 0;
      const maxFallback = typeof currentVacancy?.quantity === 'number' ? currentVacancy?.quantity : 0;

      setOffers({
        made: madeFromShift ?? madeFallback,
        max: maxFromShift ?? maxFallback,
      });

      // Postulantes
      const items: Candidate[] = (data.applications || [])
        .map(a => ({
          id: a.application_id,
          employeeId: a.employee_id,
          fullName: a.full_name,
          avatarUrl: a.profile_image,
          createdAt: a.created_at,
          shiftId: data.shift_id,
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));

      setCandidates(items);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar candidatos');
      setCandidates([]);
      setShiftInfo(null);
      setOffers(null);
    } finally {
      setLoadingApplications(false);
    }
  };

  // ===== Efectos =====

  // Carga inicial de eventos/vacantes
  useEffect(() => { fetchAllEventsVacancies(); }, []);

  // Al cambiar de evento, seleccionar primera vacante y su primer turno
  useEffect(() => {
    if (!currentEvent) return;
    if ((currentEvent.vacancies?.length ?? 0) === 0) {
      setSelectedVacancyId(null);
      setSelectedShiftId(null);
      setCandidates([]);
      setShiftInfo(null);
      setOffers(null);
      return;
    }
    const v = currentEvent.vacancies[0];
    setSelectedVacancyId(v.id);
    setSelectedShiftId(v.shiftIds[0] ?? null);
    setCandidates([]);
    setShiftInfo(null);
    setOffers(null);
  }, [currentEventIndex, currentEvent?.id]);

  // Al cambiar vacante, seleccionar primer turno
  useEffect(() => {
    if (!currentVacancy) {
      setSelectedShiftId(null);
      setCandidates([]); setShiftInfo(null); setOffers(null);
      return;
    }
    setSelectedShiftId(currentVacancy.shiftIds[0] ?? null);
    setCandidates([]); setShiftInfo(null); setOffers(null);
  }, [selectedVacancyId]);

  // Traer postulaciones cuando el turno pertenece a la vacante
  useEffect(() => {
    if (!selectedVacancyId || !selectedShiftId) return;
    const belongs = currentVacancy?.shiftIds?.includes(selectedShiftId) ?? false;
    if (!belongs) return;
    fetchApplications(selectedVacancyId, selectedShiftId);
  }, [selectedVacancyId, selectedShiftId, currentVacancy?.id]);

  // ===== Handlers =====
  const handlePrevEvent = () => { if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1); };
  const handleNextEvent = () => { if (currentEventIndex < events.length - 1) setCurrentEventIndex(i => i + 1); };

  const handleSelectVacancy = (vacancyId: number) => {
    setSelectedVacancyId(vacancyId);
    setSelectedShiftId(null);
    setCandidates([]);
    setShiftInfo(null);
    setOffers(null);
  };

  const handleSelectShift = (shiftId: number) => {
    if (shiftId === selectedShiftId) return;
    setSelectedShiftId(shiftId);
    setCandidates([]);
    setShiftInfo(null);
    setOffers(null);
  };

  // Empty states
  const hasNoEvents = !loadingEventVacancies && events.length === 0;
  const hasEventsButNoVacanciesGlobal =
    !loadingEventVacancies && events.length > 0 && events.every(ev => (ev.vacancies?.length ?? 0) === 0);
  const currentEventHasNoVacancies = !!currentEvent && (currentEvent.vacancies?.length ?? 0) === 0;
  const hasVacanciesButNoCandidates =
    !loadingApplications && !loadingEventVacancies && !!currentVacancy && candidates.length === 0;

  // Navegación a detalle de candidato
  const openCandidateDetail = (applicationId: number | string) => {
    router.push({
      pathname: '/employer/candidates/detail',
      params: { source: 'application', id: String(applicationId) },
    });
  };

  const showShiftTags = (currentVacancy?.shiftIds?.length ?? 0) > 1;

  return {
    // data
    eventName,
    currentEventIndex,
    vacancies: currentEvent?.vacancies ?? [],
    roleOptions,
    roleAnchorRef,
    selectedRoleLabel,
    selectedVacancyId,
    currentVacancy,
    shiftTags,
    selectedShiftId,
    candidates,
    shiftInfo,
    showShiftTags,

    // ofertas
    offersMade,
    offersMax,
    isFull,

    // ui
    rolePickerVisible,
    setRolePickerVisible,
    loadingEventVacancies,
    loadingApplications,
    error,

    // empties
    hasNoEvents,
    hasEventsButNoVacanciesGlobal,
    currentEventHasNoVacancies,
    hasVacanciesButNoCandidates,

    // actions
    handlePrevEvent,
    handleNextEvent,
    handleSelectVacancy,
    handleSelectShift,
    openCandidateDetail,

    // utils
    splitFirstSpace,
  };
};
