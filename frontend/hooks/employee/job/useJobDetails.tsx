import { useEffect, useState, useMemo} from 'react';
import { useLocalSearchParams } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';
import * as Crypto from 'expo-crypto';

interface Job {
  event_name?: string | null;
  start_time?: string | null;   // "HH:MM" o "HH:MM:SS"
  end_time?: string | null;     // "HH:MM" o "HH:MM:SS"
  start_date?: string | null;   // "YYYY-MM-DD"
  payment?: number | string | null;
  event_location?: string | null;
  job_type?: string | null;
  requirements?: string[]
}

const toHHMM = (t?: string | null) => (t ? String(t).slice(0, 5) : null);

export function useJobDetails() {
  const offerId = 14

  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState<boolean>(false);
  const [job, setJob] = useState<Job | null>(null);
  const [attendanceEnabled, setAttendanceEnabled] = useState<boolean>(true); // default true sin loop
  const [generating, setGenerating] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);

  useEffect(() => {
    fetchJobData();
  }, [offerId]);
  
  const fetchJobData = async () => {
    setLoading(true)
    try {
      const back = await requestBackend(`api/applications/offer-detail/${offerId}/accepted/`, null, 'GET');
      const job = back?.shift

      const requirements: string[] = Array.isArray(job?.requirements)
        ? job.requirements
            .map((r: any) => (typeof r === 'string' ? r : r?.description ?? ''))
            .filter((x: string) => !!x && x.trim().length > 0)
        : [];

      setJob({
        event_name: job.event_name,
        job_type: job.job_type,
        start_date: job.start_date,
        start_time: toHHMM(job.start_time),
        end_time: toHHMM(job.end_time),
        requirements,
        payment: job.payment,
        event_location: job?.event_location
      });

      console.log(job)

      } catch (err) {
      console.log('Hubo un error al cargar los datos:', err)
    } finally {
      setLoading(false);
    }
  };

  // Si querés habilitar el botón 15' antes del start, descomenta:
  /*
  useEffect(() => {
    const start = parseDateTimeLocal(startDate || null, startTime);
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
  }, [startDate, startTime]);
  */


  const generateQr = async () => {
    if (!attendanceEnabled) return;
    try {
      setGenerating(true);
      const seed = `${offerId}-${Date.now()}-${Math.random()}`;
      const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, seed);
    // Ej: jex|offer:4|ts:...|h:abcdef1234
      const token = `jex|offer:${offerId}|ts:${Date.now()}|h:${hash.slice(0,12)}`;
      setQrValue(token);
    } finally {
      setGenerating(false);
    }
  };

  const timeLabel = useMemo(() => {
    if (job?.start_time && job?.end_time) return `${job?.start_time} a ${job?.end_time}`;
    if (job?.start_time) return job?.start_time;
    if (job?.end_time) return job?.end_time;
    return null;
  }, [job?.start_time, job?.end_time]);

  return {
    loading,
    job,
    attendanceEnabled,
    generateQr,
    generating,
    qrValue,
    timeLabel,
  };
}
