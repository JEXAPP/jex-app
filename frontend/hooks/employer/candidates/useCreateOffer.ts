import { useEffect, useRef, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';

export type Source = 'application' | 'search';

export type RouteParams = {
  source: Source;
  id: string;           // applicationId (application) | employeeId (search)
  vacancyId?: string;   // SOLO en search: id de la vacante ya elegida
  personName?: string;  // SOLO en search: nombre para header
  photoUrl?: string;    // SOLO en search: url de foto para header
};

type EventWithVacancies = {
  event_id: number;
  event_name: string;
  vacancies: { vacancy_id: number; job_type_name: string }[];
};

export type VacancyDetail = {
  id: number;
  description: string;
  job_type_name: string;
  requirements: { description: string }[] | string[];
  shifts: {
    id: number;
    start_date: string; // dd/mm/yyyy
    end_date: string;   // dd/mm/yyyy
    start_time: string; // HH:MM
    end_time: string;   // HH:MM
    payment: string;    // "15000.00"
  }[];
};

type ApplicationDetail = {
  employee: { profile_image: string | null; name: string };
  shift: {
    start_date: string; end_date: string;
    start_time: string; end_time: string;
    payment: string;
    vacancy: { job_type: string; description: string; requirements: string[] }
  }
};

export function useCreateOffer(params: RouteParams) {
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  // Refs para usar parámetros iniciales sin re-render
  const sourceRef = useRef(params.source);
  const idRef = useRef(params.id);
  const vacancyIdRef = useRef(params.vacancyId);

  // Header (persona)
  const [employeeName, setEmployeeName] = useState<string>(params.personName ?? '—');
  const [employeeImage, setEmployeeImage] = useState<string | null>(params.photoUrl ?? null);

  // Detalle de vacante y selección de turnos
  const [vacancyDetail, setVacancyDetail] = useState<VacancyDetail | null>(null);
  const [selectedShiftIds, setSelectedShiftIds] = useState<number[]>([]);

  // Expiración + comentario
  const [expDate, setExpDate] = useState<Date | null>(null);
  const [expTime, setExpTime] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Modal de selección (solo búsqueda sin vacancyId)
  const [modalVisible, setModalVisible] = useState(sourceRef.current === 'search' && !vacancyIdRef.current);
  const [events, setEvents] = useState<EventWithVacancies[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [vacancyOptions, setVacancyOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // Helpers
  const setShiftsFromDetail = (detail: VacancyDetail) =>
    setSelectedShiftIds(detail?.shifts?.length === 1 ? [detail.shifts[0].id] : []);

  const loadVacancyDetail = async (vacancyId: number) => {
    const detail: VacancyDetail = await requestBackend(`/api/vacancies/${vacancyId}/shifts/`, null, 'GET');
    setVacancyDetail(detail);
    setSelectedVacancyId(vacancyId);
    setShiftsFromDetail(detail);
    setModalVisible(false);
  };

  const formatDDMMYYYY = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  // Carga inicial según source/params
  useEffect(() => {
    (async () => {
      try {
        if (sourceRef.current === 'application') {
          const res: ApplicationDetail = await requestBackend(`/api/applications/${idRef.current}/detail/`, null, 'GET');
          setEmployeeName(res?.employee?.name ?? params.personName ?? '—');
          setEmployeeImage(res?.employee?.profile_image ?? params.photoUrl ?? null);

          const vac: VacancyDetail = {
            id: -1,
            job_type_name: res.shift?.vacancy?.job_type ?? '—',
            description: res.shift?.vacancy?.description ?? '',
            requirements: res.shift?.vacancy?.requirements ?? [],
            shifts: [{
              id: 0,
              start_date: res.shift.start_date,
              end_date: res.shift.end_date,
              start_time: res.shift.start_time,
              end_time: res.shift.end_time,
              payment: res.shift.payment,
            }],
          };
          setVacancyDetail(vac);
          setSelectedShiftIds([0]);
          return;
        }

        // search
        if (vacancyIdRef.current) {
          await loadVacancyDetail(Number(vacancyIdRef.current));
        } else {
          const evs: EventWithVacancies[] = await requestBackend('/api/events/with-vacancies-availables/', null, 'GET');
          setEvents(evs || []);
        }
      } catch (e) {
        console.log('Error carga inicial de oferta', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers modal (búsqueda)
  const onSelectEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    const ev = events.find(e => e.event_id === eventId);
    setVacancyOptions((ev?.vacancies ?? []).map(v => ({ id: v.vacancy_id, name: v.job_type_name })));
    setSelectedVacancyId(null);
  };

  const onSelectVacancy = async (vacancyId: number) => {
    try { await loadVacancyDetail(vacancyId); }
    catch (e) { console.log('Error GET vacancy detail', e); }
  };

  // Submit
  const buildBody = () => {
    const base = {
      additional_comments: comment,
      expiration_date: expDate ? formatDDMMYYYY(expDate) : null,
      expiration_time: expTime ?? null,
    };
    return sourceRef.current === 'application'
      ? { ...base, application_id: Number(idRef.current) }
      : { ...base, employee_id: Number(idRef.current), shift_ids: selectedShiftIds };
  };

  const submitOffer = async () => {
    try {
      setLoading(true);
      const res = await requestBackend('/api/applications/offers/', buildBody(), 'POST');
      return res;
    } catch (e) {
      console.log('Error POST /api/applications/offers/', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Utils
  function moneyARS(v: string | number | null | undefined) {
    if (v == null) return '—';
    const n = typeof v === 'string' ? Number(v) : v;
    if (Number.isNaN(n)) return String(v);
    return `${Math.round(n).toLocaleString('es-AR')} ARS`;
  }
  function hhmmLabel(hhmm?: string | null) {
    if (!hhmm) return '';
    const [hh = '00', mm = '00'] = (hhmm || '').split(':');
    return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}hs`;
  }

  const handleCancel = () => router.back();

  return {
    // persona
    employeeName, employeeImage,
    // vacante/turnos
    vacancyDetail, selectedShiftIds, setSelectedShiftIds, moneyARS, hhmmLabel,
    // expiración/comentario
    expDate, setExpDate, expTime, setExpTime, comment, setComment,
    // modal búsqueda
    modalVisible, setModalVisible, events, selectedEventId, vacancyOptions, selectedVacancyId,
    onSelectEvent, onSelectVacancy,
    // acciones
    submitOffer, handleCancel, loading,
  };
}
