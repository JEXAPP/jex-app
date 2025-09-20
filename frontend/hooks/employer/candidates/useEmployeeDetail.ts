import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

type Source = 'application' | 'search';
type Params = { source: Source; id: string; vacancyId?: string };

type ShiftAPI = {
  id?: number | string;
  start_date: string;  // dd/mm/yyyy
  start_time: string;  // HH:MM
  end_date: string;    // dd/mm/yyyy
  end_time: string;    // HH:MM
  payment: string;     // "12000.00"
};

type ApplicationAPI = {
  age: number | null;
  approximate_location: string | null;
  description: string | null;
  name: string;
  profile_image: string | null;
  current_shift?: ShiftAPI | null;
  shifts?: ShiftAPI[];
};

type SearchAPI = {
  age: number | null;
  approximate_location: string | null;
  description: string | null;
  name: string;
  profile_image: string | null;
};

export type NormalizedDetail = {
  employee_id?: number | string | null;
  profile_image: string | null;
  name: string;
  description: string | null;
  age: number | null;
  approximate_location?: string | null;
  shiftCards?: Array<{
    id?: number | string;
    start_date_label: string;
    time_range_label: string;
    payment_label: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    payment: string;
    isCurrent?: boolean;
  }>;
  applied_shift_ids: Array<number | string>;
};

/* Helpers */
function formatearFecha(fecha: string) {
  if (!fecha) return '';
  if (fecha.includes('/')) return fecha;
  if (fecha.includes('-')) {
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }
  return '';
}
function formatearHora(hora?: string) {
  if (!hora) return '';
  const [hh = '00', mm = '00'] = hora.split(':');
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}hs`;
}
function dateLabelFromDDMMYYYY(ddmmyyyy: string) {
  const [d, m, y] = ddmmyyyy.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  const fmt = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const s = fmt.format(dt);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function moneyARS(v: string | number | null | undefined) {
  if (v == null) return '—';
  const n = typeof v === 'string' ? Number(v) : v;
  if (Number.isNaN(n)) return String(v);
  return `${Math.round(n).toLocaleString('es-AR')} ARS`;
}

export const useEmployeeDetail = (p: Params) => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<NormalizedDetail | null>(null);

  // estado del ClickWindow (confirmación)
  const [confirmRejectVisible, setConfirmRejectVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        if (p.source === 'application') {
          const res: ApplicationAPI = await requestBackend(
            `/api/applications/apply/${p.id}/detail/`,
            null,
            'GET',
          );

          const buildCard = (sh?: ShiftAPI | null, isCurrent?: boolean) => {
            if (!sh) return null;
            const start = formatearFecha(sh.start_date);
            const end   = formatearFecha(sh.end_date);
            return {
              id: sh.id,
              start_date_label: dateLabelFromDDMMYYYY(start),
              time_range_label: `${formatearHora(sh.start_time)} - ${formatearHora(sh.end_time)}`,
              payment_label:    moneyARS(sh.payment),
              start_date: start,
              start_time: sh.start_time,
              end_date: end,
              end_time: sh.end_time,
              payment: sh.payment,
              isCurrent: !!isCurrent,
            };
          };

          const cards: NormalizedDetail['shiftCards'] = [];
          const current = buildCard(res.current_shift, true);
          if (current) cards.push(current);
          (res.shifts ?? []).forEach(sh => {
            const c = buildCard(sh, false);
            if (c) cards.push(c);
          });

          const appliedIds = cards?.map(c => c?.id).filter(Boolean) as Array<number | string>;

          const normalized: NormalizedDetail = {
            employee_id: null,
            profile_image: res.profile_image || null,
            name: res.name,
            description: res.description ?? null,
            age: res.age ?? null,
            approximate_location: res.approximate_location ?? null,
            shiftCards: cards ?? [],
            applied_shift_ids: appliedIds ?? [],
          };

          if (mounted) setData(normalized);
        } else {
          const res: SearchAPI = await requestBackend(
            `/api/applications/employees/search/${p.id}`,
            null,
            'GET',
          );

          const normalized: NormalizedDetail = {
            employee_id: p.id,
            profile_image: res.profile_image || null,
            name: res.name,
            description: res.description ?? null,
            age: res.age ?? null,
            approximate_location: res.approximate_location ?? null,
            shiftCards: [],
            applied_shift_ids: [],
          };

          if (mounted) setData(normalized);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error al cargar el detalle.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => { mounted = false; };
  }, [p.source, p.id]);

  const goBack = () => router.back();

  const onGenerateOffer = () => {
    const userId  = (data?.employee_id ?? p.id) as string | number;

    router.push({
      pathname: '/employer/candidates/offer', 
      params: {
        source: p.source,
        id: String(userId),
        ...(p.source === 'search' && p.vacancyId ? { vacancyId: String(p.vacancyId) } : {}),
        personName: data?.name ?? '',
        photoUrl: data?.profile_image ?? '',
      },
    });
  };

  const shiftSummary = useMemo(() => {
    const first = data?.shiftCards?.[0];
    return first ? first.time_range_label : '';
  }, [data?.shiftCards]);

  // ===== Rechazo (confirmación en el render, request aquí) =====
  const openConfirmReject  = () => setConfirmRejectVisible(true);
  const closeConfirmReject = () => setConfirmRejectVisible(false);

  const confirmReject = async () => {
    try {
      setConfirmRejectVisible(false);
      await requestBackend(`/api/applications/rejected/${p.id}`, null, 'PUT');
      router.replace('/employer/candidates');
    } catch (e: any) {
      setError(e?.message || 'Error al rechazar la postulación');
    }
  };

  return {
    // datos
    loading, error, data, shiftSummary,

    // navegación
    goBack,
    onGenerateOffer,

    // confirm/estado modal
    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,
  };
};
