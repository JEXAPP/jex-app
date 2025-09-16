// hooks/employer/offers/useCreateOffer.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

type Source = 'application' | 'search';
type Params = {
  source: Source;
  id: string; // applicationId si source='application' | employeeId si source='search'
  // opcional en postulación: vacancyId por si querés mostrarlo
};

type EventOption = { id: number; name: string };
type VacancyOption = { id: number; name: string };

type VacancyDetailAPI = {
  id: number;
  description: string | null;
  job_type_name: string;
  requirements: { description: string }[];
  shifts: Array<{
    id: number;
    start_date: string; // dd/mm/yyyy
    end_date: string;   // dd/mm/yyyy
    start_time: string; // HH:MM
    end_time: string;   // HH:MM
    payment: string;    // "15000.00"
    is_full?: boolean;  // si el backend alguna vez lo manda
  }>;
};

type ApplicationDetailAPI = {
  employee: { profile_image: string | null; name: string };
  shift: {
    start_date: string; end_date: string; start_time: string; end_time: string; payment: string;
    vacancy: { job_type: string; description: string | null; requirements: string[] };
  };
};

type BusyAPI = Array<{
  id: number;
  start_date: string; end_date: string; start_time: string; end_time: string; // ISO en este endpoint
}>;

function moneyARS(v: string | number) {
  const n = typeof v === 'string' ? Number(v) : v;
  if (Number.isNaN(n)) return String(v);
  return `${Math.round(n).toLocaleString('es-AR')} ARS`;
}
function ddmmyyyyToLabel(dmy: string) {
  const [d, m, y] = dmy.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  const fmt = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const s = fmt.format(dt);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const shiftLabel = (s: {start_date:string;end_date:string;start_time:string;end_time:string}) =>
  `${s.start_time}hs - ${s.end_time}hs`;

export const useCreateOffer = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { source, id } = useLocalSearchParams<{source: Source; id: string}>() as any;

  // ===== UI principal =====
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // ===== Selección previa (solo búsqueda) =====
  const [selectorOpen, setSelectorOpen] = useState(source === 'search'); // modal previo
  const [events, setEvents] = useState<EventOption[]>([]);
  const [vacancies, setVacancies] = useState<VacancyOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');    // DropDown2 usa string
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('');

  // ===== Detalle de vacante + turnos disponibles =====
  const [vacancyDetail, setVacancyDetail] = useState<VacancyDetailAPI | null>(null);
  const [availableShifts, setAvailableShifts] = useState<VacancyDetailAPI['shifts']>([]);
  const [chosenShiftId, setChosenShiftId] = useState<number | null>(null);

  // ===== Postulación (resumen directo) =====
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetailAPI | null>(null);

  // ===== Datos de oferta =====
  const [expirationDate, setExpirationDate] = useState<Date | null>(null); // DatePicker
  const [expirationTime, setExpirationTime] = useState<string | null>(null); // TimePicker (HH:mm)
  const [comments, setComments] = useState<string>('');

  // ===== Busy (búsqueda) — para debug por ahora
  const [busy, setBusy] = useState<BusyAPI>([]);

  // flags de “ya llamé”
  const fetchedEvents = useRef(false);
  const fetchedVacancy = useRef(false);
  const fetchedAppDetail = useRef(false);
  const fetchedBusy = useRef(false);

  // ---------- CARGA INICIAL ----------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (source === 'application') {
          if (fetchedAppDetail.current) return;
          fetchedAppDetail.current = true;

          const url = `/api/applications/apply/${id}/detail/`;
          const app: ApplicationDetailAPI = await requestBackend(url, null, 'GET');
          console.log('[GET]', url, app);
          setApplicationDetail(app);

          // “Vacante” simplificada desde el detalle de aplicación
          const fakeVacancy: VacancyDetailAPI = {
            id: 0,
            job_type_name: app.shift.vacancy.job_type,
            description: app.shift.vacancy.description,
            requirements: (app.shift.vacancy.requirements || []).map(d => ({ description: d })),
            shifts: [{
              id: 0,
              start_date: app.shift.start_date,
              end_date: app.shift.end_date,
              start_time: app.shift.start_time,
              end_time: app.shift.end_time,
              payment: app.shift.payment,
            }],
          };
          setVacancyDetail(fakeVacancy);
          setAvailableShifts(fakeVacancy.shifts);
          setChosenShiftId(fakeVacancy.shifts[0]?.id ?? null);
        } else {
          // BÚSQUEDA: abrir modal y precargar eventos+vacantes
          if (fetchedEvents.current) return;
          fetchedEvents.current = true;

          const url = `/api/events/with-vacancies-availables/`;
          const evs: Array<{event_id:number; event_name:string; vacancies:{vacancy_id:number; job_type_name:string}[]}> =
            await requestBackend(url, null, 'GET');
          console.log('[GET]', url, evs);

          const evOpts = evs.map(e => ({ id: e.event_id, name: e.event_name }));
          setEvents(evOpts);

          // si querés precargar la primera lista de vacantes:
          const first = evs[0];
          if (first) {
            setSelectedEventId(String(first.event_id));
            setVacancies(first.vacancies.map(v => ({ id: v.vacancy_id, name: v.job_type_name })));
            setSelectedVacancyId(first.vacancies[0] ? String(first.vacancies[0].vacancy_id) : '');
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <— deps vacías para evitar bucles

  // Cargar detalle de vacante al confirmar selección (búsqueda)
  const confirmSelector = async () => {
    try {
      if (!selectedVacancyId) {
        Alert.alert('Elegí una vacante.');
        return;
      }
      const vId = Number(selectedVacancyId);
      const url = `/api/vacancies/${vId}/shifts/`;
      const det: VacancyDetailAPI = await requestBackend(url, null, 'GET');
      console.log('[GET]', url, det);

      // filtrar llenos si backend manda is_full=true
      const avail = (det.shifts || []).filter(s => s.is_full !== true);
      setVacancyDetail(det);
      setAvailableShifts(avail);
      setChosenShiftId(avail[0]?.id ?? null);

      // Busy del empleado (para búsqueda)
      if (source === 'search' && !fetchedBusy.current) {
        fetchedBusy.current = true;
        const busyUrl = `/api/applications/offers/${id}/shifts`;
        const busyRes: BusyAPI = await requestBackend(busyUrl, null, 'GET');
        console.log('[GET]', busyUrl, busyRes);
        setBusy(busyRes || []);
      }

      setSelectorOpen(false);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar vacante');
    }
  };

  // Cambiar evento en el modal => actualizar lista de vacantes
  const onChangeEvent = (eventId: string, rawAll?: any[]) => {
    setSelectedEventId(eventId);
    const evIdNum = Number(eventId);
    const found = (rawAll || []).find(e => e.event_id === evIdNum);
    if (found) {
      const vacs = (found.vacancies || []).map((v: any) => ({ id: v.vacancy_id, name: v.job_type_name }));
      setVacancies(vacs);
      setSelectedVacancyId(vacs[0] ? String(vacs[0].id) : '');
    }
  };

  // Datos render
  const header = useMemo(() => {
    if (source === 'application' && applicationDetail) {
      return {
        name: applicationDetail.employee.name,
        profileImage: applicationDetail.employee.profile_image,
      };
    }
    return null;
  }, [source, applicationDetail]);

  // POST crear oferta
  const submitOffer = async () => {
    try {
      if (!expirationDate || !expirationTime) {
        Alert.alert('Completá fecha y hora de vencimiento.');
        return;
      }

      const payload =
        source === 'application'
          ? {
              application_id: Number(id),
              additional_comments: comments || '',
              expiration_date: toDDMMYYYY(expirationDate),
              expiration_time: expirationTime,
            }
          : {
              employee_id: Number(id),
              shift_ids: chosenShiftId ? [chosenShiftId] : [],
              additional_comments: comments || '',
              expiration_date: toDDMMYYYY(expirationDate),
              expiration_time: expirationTime,
            };

      const url = `/api/applications/offers/`;
      const res = await requestBackend(url, payload, 'POST');
      console.log('[POST]', url, payload, res);
      Alert.alert('Oferta creada', 'Se envió la oferta correctamente.');
      router.back();
    } catch (e: any) {
      setError(e?.message || 'No se pudo crear la oferta');
    }
  };

  return {
    // origen
    source, id,

    // ui principal
    loading, error,

    // header (postulación)
    header,

    // selector previo (búsqueda)
    selectorOpen, setSelectorOpen,
    events, vacancies,
    selectedEventId, setSelectedEventId,
    selectedVacancyId, setSelectedVacancyId,
    confirmSelector,

    // data vacante/turnos
    vacancyDetail,
    availableShifts,
    chosenShiftId, setChosenShiftId,

    // busy (debug)
    busy,

    // form
    expirationDate, setExpirationDate,
    expirationTime, setExpirationTime,
    comments, setComments,

    // actions
    submitOffer,

    // helper para actualizar vacantes al cambiar evento con la respuesta cruda
    onChangeEvent,
    ddmmyyyyToLong, money,
  };
};
function money(v: string) { return moneyARS(v as any); }

// utils
function toDDMMYYYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function ddmmyyyyToLong(dmy: string) {
  const [d, m, y] = dmy.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('es-AR', { weekday:'long', day:'numeric', month:'long' })
    .format(dt).replace(/^./, m => m.toUpperCase());
}