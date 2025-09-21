import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

interface Job {
  event_name?: string | null;
  start_time?: string | null;   // "HH:MM" o "HH:MM:SS"
  end_time?: string | null;     // "HH:MM" o "HH:MM:SS"
  start_date?: string | null;   // "YYYY-MM-DD"
  payment?: number | string | null;
  event_location?: string | null;
  job_type?: string | null;
  requirements?: string[];
}

type WeekDay = { date: string; label: string; };

function parseDateTimeLocal(dateStr?: string | null, timeStr?: string | null): Date | null {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm, ss = '0'] = String(timeStr).split(':');
  const h  = Number(hh);
  const mi = Number(mm);
  const s  = Number(ss);
  if ([y, m, d, h, mi, s].some(n => Number.isNaN(n))) return null;
  return new Date(y, (m - 1), d, h, mi, s, 0);
}

const toHHMM = (t?: string | null) => (t ? String(t).slice(0, 5) : null);

function buildWeekFromDate(dateStr?: string | null): WeekDay[] {
  if (!dateStr) return [];
  const base = new Date(dateStr + 'T00:00:00');
  if (isNaN(base.getTime())) return [];
  const day = base.getDay(); 
  const mondayOffset = ((day + 6) % 7);
  const monday = new Date(base);
  monday.setDate(base.getDate() - mondayOffset);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const shortLabel = (d: Date) =>
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()] + ' ' + d.getDate();
  const out: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    out.push({ date: fmt(d), label: shortLabel(d) });
  }
  return out;
}

export function useJobDetails() {
  const params = useLocalSearchParams<{ offer_id?: string }>();
  const offerId = Number(params.offer_id) || 4;

  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState<boolean>(true);
  const [job, setJob] = useState<Job | null>(null);

  const [attendanceEnabled, setAttendanceEnabled] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);

  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    fetchJobData();
  }, [offerId]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const back = await requestBackend(`/api/applications/offer-detail/${offerId}/accepted/`, null, 'GET');
      console.log(back)
      const shift = back?.shift;

      const requirements: string[] = Array.isArray(shift?.requirements)
        ? shift.requirements
            .map((r: any) => (typeof r === 'string' ? r : r?.description ?? ''))
            .filter((x: string) => !!x && x.trim().length > 0)
        : [];

      const normalized: Job = {
        event_name: shift?.event_name ?? null,
        job_type: shift?.job_type ?? null,
        start_date: shift?.start_date ?? null,
        start_time: toHHMM(shift?.start_time),
        end_time: toHHMM(shift?.end_time),
        requirements,
        payment: shift?.payment ?? null,
        event_location: shift?.event_location ?? null,
      };

      setJob(normalized);

      if (normalized.start_date) {
        const wk = buildWeekFromDate(normalized.start_date);
        setWeekDays(wk);
        setSelectedDay(normalized.start_date);
      } else {
        setWeekDays([]);
        setSelectedDay(null);
      }
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      const url = e?.config?.url;
      console.log('[API ERROR]', status, url, data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = parseDateTimeLocal(job?.start_date || null, job?.start_time || null);
    if (!start) {
      setAttendanceEnabled(false);
      return;
    }
    const compute = () => {
      const enableAt = new Date(start.getTime() - 15 * 60 * 1000);
      setAttendanceEnabled(new Date() >= enableAt);
    };
    compute();
    const id = setInterval(compute, 15_000);
    return () => clearInterval(id);
  }, [job?.start_date, job?.start_time]);

  /*
  useEffect(() => {
    setAttendanceEnabled(false);
  }, []);
  PARA DESHABILITAR Y HABILITAR EL BOTON MANUALMENTE*/

  const generateQR = async () => {
    if (!attendanceEnabled || generating) return;
    try {
      setGenerating(true);
      const res = await requestBackend(
        `/api/applications/attendance/${offerId}/generate-qr/`,
        null,
        'GET'
      );
      const token = res?.qr_token ?? (typeof res === 'string' ? res : null);
      setQrValue(token || null);
      setShowQR(true);
    } catch (err: any) {
      console.log('[ERROR]', err?.response?.status, err?.response?.data);
    } finally {
      setGenerating(false);
    }
  };

  const timeLabel = useMemo(() => {
    if (job?.start_time && job?.end_time) return `${job.start_time} a ${job.end_time}`;
    if (job?.start_time) return job.start_time;
    if (job?.end_time) return job.end_time;
    return null;
  }, [job?.start_time, job?.end_time]);

  const eventLocation = useMemo(() => {
    return job?.event_location || 'A definir';
  }, [job?.event_location]);

  return {
    loading,
    job,
    weekDays,
    selectedDay,
    setSelectedDay,
    timeLabel,
    eventLocation,
    attendanceEnabled,
    generateQR,
    generating,
    qrValue,
    showQR,
    setShowQR,
  };
}
