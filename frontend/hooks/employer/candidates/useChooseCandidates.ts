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
  average_rating: number | null;
  rating_count: number;
};

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
  averageRating: number | null;
  ratingCount: number;
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

// sharedEventName: nombre del evento seleccionado en el layout compartido
export const useChooseCandidates = (sharedEventName: string | null) => {
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const roleAnchorRef = useRef<View | null>(null);
  const applicationsRequestIdRef = useRef(0);

  const [events, setEvents] = useState<{ id: string; name: string; vacancies: VacancySummary[] }[]>([]);

  // Deriva el índice del evento a partir del nombre compartido
  const currentEventIndex = useMemo(() => {
    if (!sharedEventName || events.length === 0) return 0;
    const idx = events.findIndex(e => e.name === sharedEventName);
    return idx >= 0 ? idx : 0;
  }, [events, sharedEventName]);

  const currentEvent = events.length ? events[Math.min(currentEventIndex, events.length - 1)] : null;

  const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);
  const currentVacancy = useMemo(
    () => currentEvent?.vacancies.find(v => v.id === selectedVacancyId) ?? null,
    [currentEvent, selectedVacancyId]
  );

  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [shiftInfo, setShiftInfo] = useState<ShiftInfo | null>(null);

  const [offers, setOffers] = useState<{ made: number; max: number } | null>(null);

  const [rolePickerVisible, setRolePickerVisible] = useState(false);
  const [loadingEventVacancies, setLoadingEventVacancies] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const offersMade = offers?.made ?? null;
  const offersMax = offers?.max ?? null;
  const isFull = offers ? offers.max > 0 && offers.made >= offers.max : false;

  // ===== Requests =====

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
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar eventos y vacantes');
      setEvents([]);
      setSelectedVacancyId(null);
      setSelectedShiftId(null);
    } finally {
      setLoadingEventVacancies(false);
    }
  };

  const resetApplicationsState = () => {
    setCandidates([]);
    setShiftInfo(null);
    setOffers(null);
  };

  const fetchApplications = async (vacancyId: number | null, shiftId: number | null) => {
    if (!vacancyId || !shiftId) {
      resetApplicationsState();
      setHasLoadedApplications(false);
      return;
    }

    const requestId = ++applicationsRequestIdRef.current;

    setLoadingApplications(true);
    setHasLoadedApplications(false);
    setError(null);

    try {
      const data: ApplicationsByShiftAPI = await requestBackend(
        ENDPOINTS.applicationsByVacancyShift(vacancyId, shiftId),
        null,
        'GET'
      );

      if (requestId !== applicationsRequestIdRef.current) return;

      setShiftInfo({
        shiftId: data.shift_id,
        startDate: data.start_date,
        endDate: data.end_date,
        startTime: data.start_time,
        endTime: data.end_time,
      });

      const madeFromShift = typeof data.quantity_offers === 'number' ? data.quantity_offers : undefined;
      const maxFromShift = typeof data.quantity === 'number' ? data.quantity : undefined;

      const madeFallback =
        typeof currentVacancy?.quantityOffers === 'number' ? currentVacancy?.quantityOffers : 0;
      const maxFallback = typeof currentVacancy?.quantity === 'number' ? currentVacancy?.quantity : 0;

      setOffers({
        made: madeFromShift ?? madeFallback,
        max: maxFromShift ?? maxFallback,
      });

      const items: Candidate[] = (data.applications || [])
        .map(a => ({
          id: a.application_id,
          employeeId: a.employee_id,
          fullName: a.full_name,
          avatarUrl: a.profile_image,
          createdAt: a.created_at,
          shiftId: data.shift_id,
          averageRating: a.average_rating,
          ratingCount: a.rating_count,
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));

      setCandidates(items);
    } catch (e: any) {
      if (requestId !== applicationsRequestIdRef.current) return;
      setError(e?.message ?? 'Error al cargar candidatos');
      resetApplicationsState();
    } finally {
      if (requestId !== applicationsRequestIdRef.current) return;
      setLoadingApplications(false);
      setHasLoadedApplications(true);
    }
  };

  // ===== Efectos =====

  useEffect(() => {
    fetchAllEventsVacancies();
  }, []);

  // Al cambiar de evento (por nombre compartido), seleccionar primera vacante y su primer turno
  useEffect(() => {
    if (!currentEvent) return;

    applicationsRequestIdRef.current += 1;

    if ((currentEvent.vacancies?.length ?? 0) === 0) {
      setSelectedVacancyId(null);
      setSelectedShiftId(null);
      resetApplicationsState();
      setHasLoadedApplications(false);
      return;
    }

    const v = currentEvent.vacancies[0];
    setSelectedVacancyId(v.id);
    setSelectedShiftId(v.shiftIds[0] ?? null);

    resetApplicationsState();
    setHasLoadedApplications(false);
  }, [currentEventIndex, currentEvent?.id]);

  useEffect(() => {
    applicationsRequestIdRef.current += 1;

    if (!currentVacancy) {
      setSelectedShiftId(null);
      resetApplicationsState();
      setHasLoadedApplications(false);
      return;
    }

    setSelectedShiftId(currentVacancy.shiftIds[0] ?? null);
    resetApplicationsState();
    setHasLoadedApplications(false);
  }, [selectedVacancyId]);

  useEffect(() => {
    if (!selectedVacancyId || !selectedShiftId) return;

    const belongs = currentVacancy?.shiftIds?.includes(selectedShiftId) ?? false;
    if (!belongs) return;

    fetchApplications(selectedVacancyId, selectedShiftId);
  }, [selectedVacancyId, selectedShiftId, currentVacancy?.id]);

  // ===== Handlers =====

  const handleSelectVacancy = (vacancyId: number) => {
    applicationsRequestIdRef.current += 1;

    setSelectedVacancyId(vacancyId);
    setSelectedShiftId(null);

    resetApplicationsState();
    setHasLoadedApplications(false);
  };

  const handleSelectShift = (shiftId: number) => {
    if (shiftId === selectedShiftId) return;

    applicationsRequestIdRef.current += 1;

    setSelectedShiftId(shiftId);

    resetApplicationsState();
    setHasLoadedApplications(false);
  };

  // Empty states
  const hasNoEvents = !loadingEventVacancies && events.length === 0;

  const hasEventsButNoVacanciesGlobal =
    !loadingEventVacancies && events.length > 0 && events.every(ev => (ev.vacancies?.length ?? 0) === 0);

  const currentEventHasNoVacancies = !!currentEvent && (currentEvent.vacancies?.length ?? 0) === 0;

  const hasVacanciesButNoCandidates =
    hasLoadedApplications &&
    !loadingApplications &&
    !loadingEventVacancies &&
    !!currentVacancy &&
    candidates.length === 0;

  const openCandidateDetail = (applicationId: number | string) => {
    router.push({
      pathname: '/employer/candidates/detail',
      params: { source: 'application', id: String(applicationId) },
    });
  };

  const showShiftTags = (currentVacancy?.shiftIds?.length ?? 0) > 1;

  return {
    eventName,
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
    offersMade,
    offersMax,
    isFull,
    rolePickerVisible,
    setRolePickerVisible,
    loadingEventVacancies,
    loadingApplications,
    error,
    hasNoEvents,
    hasEventsButNoVacanciesGlobal,
    currentEventHasNoVacancies,
    hasVacanciesButNoCandidates,
    handleSelectVacancy,
    handleSelectShift,
    openCandidateDetail,
    splitFirstSpace,
  };
};
