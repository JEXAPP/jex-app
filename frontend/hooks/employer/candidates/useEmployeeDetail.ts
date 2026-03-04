import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

type Source = 'application' | 'search';
type Params = { source: Source; id: string; vacancyId?: string };

type ShiftAPI = {
  id?: number | string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  payment: string;
};

type ApplicationAPI = {
  rating_count: number;
  average_rating: number;
  age: number | null;
  approximate_location: string | null;
  description: string | null;
  name: string;
  profile_image: string | null;
  current_shift?: ShiftAPI | null;
  shifts?: ShiftAPI[];
  employee_id?: number;
  // Por ahora asumimos que esta API no trae historial ni idiomas
};

type WorkExperienceAPI = {
  id: number;
  title: string;
  company_or_event: string;
  start_date: string;   // yyyy-mm-dd
  end_date: string;     // yyyy-mm-dd
  description: string | null;
  image_url?: string | null;
};

type EducationAPI = {
  id: number;
  institution: string;
  title: string;
  discipline: string | null;
  start_date: string;   // yyyy-mm-dd
  end_date: string;     // yyyy-mm-dd
  description: string | null;
  image_url?: string | null;
};

type LanguageAPI = {
  id?: number | string;
  language?: string;
  level?: string;
  idioma?: string;
  nivel?: string;
  name?: string;
};

type SearchAPI = {
  age: number | null;
  approximate_location: string | null;
  description: string | null;
  name: string;
  profile_image: string | null;
  average_rating: number | null;
  rating_count: number | null;

  work_experiences?: WorkExperienceAPI[];
  educations?: EducationAPI[];
  languages?: LanguageAPI[];
};

export type NormalizedExperience = {
  id: number | string;
  title: string;
  place: string;
  extra?: string | null;
  startDateLabel: string;
  endDateLabel: string;
  startTimestamp: number;
  description: string | null;
  imageUrls: string[];
};

export type NormalizedEducation = NormalizedExperience;

export type NormalizedLanguage = {
  id: number | string;
  name: string;
  level?: string | null;
};

export type NormalizedDetail = {
  employee_id?: number | string | null;
  profile_image: string | null;
  name: string;
  description: string | null;
  age: number | null;
  approximate_location?: string | null;
  average_rating?: number | null;
  rating_count?: number | null;
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

  workExperiences?: NormalizedExperience[];
  educations?: NormalizedEducation[];
  languages?: NormalizedLanguage[];
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
  const s = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(y, m - 1, d));
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function moneyARS(v: string | number | null | undefined) {
  if (v == null) return '—';
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isNaN(n) ? String(v) : `${Math.round(n).toLocaleString('es-AR')} ARS`;
}

export const useEmployeeDetail = (p: Params) => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NormalizedDetail | null>(null);

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
            'GET'
          );

          const buildCard = (sh?: ShiftAPI | null, isCurrent?: boolean) =>
            sh &&
            (() => {
              const start = formatearFecha(sh.start_date);
              const end = formatearFecha(sh.end_date);
              return {
                id: sh.id,
                start_date_label: dateLabelFromDDMMYYYY(start),
                time_range_label: `${formatearHora(sh.start_time)} - ${formatearHora(
                  sh.end_time
                )}`,
                payment_label: moneyARS(sh.payment),
                start_date: start,
                start_time: sh.start_time,
                end_date: end,
                end_time: sh.end_time,
                payment: sh.payment,
                isCurrent: !!isCurrent,
              };
            })();

          const cards = [
            buildCard(res.current_shift, true),
            ...(res.shifts ?? []).map((s) => buildCard(s, false)),
          ].filter(Boolean) as NonNullable<NormalizedDetail['shiftCards']>;

          const normalized: NormalizedDetail = {
            employee_id: res.employee_id ?? null,
            profile_image: res.profile_image || null,
            name: res.name,
            description: res.description ?? null,
            age: res.age ?? null,
            approximate_location: res.approximate_location ?? null,
            shiftCards: cards,
            applied_shift_ids: cards.map((c) => c.id!).filter(Boolean),
            average_rating: res.average_rating ?? 0,
            rating_count: res.rating_count ?? 0,

            workExperiences: [],
            educations: [],
            languages: [],
          };

          if (mounted) setData(normalized);
        } else {
          const res: SearchAPI = await requestBackend(
            `/api/applications/employees/search/${p.id}/`,
            null,
            'GET'
          );

          const exps: NormalizedExperience[] = (res.work_experiences ?? []).map(
            (w) => {
              const startLabel = formatearFecha(w.start_date);
              const endLabel = formatearFecha(w.end_date);
              const ts = w.start_date ? new Date(w.start_date).getTime() : 0;
              const imageUrls: string[] = w.image_url ? [w.image_url] : [];
              return {
                id: w.id,
                title: w.title || 'Experiencia',
                place: w.company_or_event || '',
                extra: null,
                startDateLabel: startLabel,
                endDateLabel: endLabel,
                startTimestamp: ts,
                description: w.description ?? null,
                imageUrls,
              };
            }
          );

          const edus: NormalizedEducation[] = (res.educations ?? []).map(
            (e) => {
              const startLabel = formatearFecha(e.start_date);
              const endLabel = formatearFecha(e.end_date);
              const ts = e.start_date ? new Date(e.start_date).getTime() : 0;
              const imageUrls: string[] = e.image_url ? [e.image_url] : [];
              const sub = e.discipline ? `${e.institution} • ${e.discipline}` : e.institution;
              return {
                id: e.id,
                title: e.title || 'Estudio / Certificación',
                place: sub || '',
                extra: e.discipline,
                startDateLabel: startLabel,
                endDateLabel: endLabel,
                startTimestamp: ts,
                description: e.description ?? null,
                imageUrls,
              };
            }
          );

          const langs: NormalizedLanguage[] = (res.languages ?? [])
            .map((l: any, idx) => {
              const name = l.language ?? l.name ?? l.idioma ?? '';

              // level puede venir como string o como objeto { id, name }
              const rawLevel = l.level ?? l.nivel ?? null;
              let level: string | null = null;

              if (typeof rawLevel === 'string') {
                level = rawLevel;
              } else if (rawLevel && typeof rawLevel === 'object') {
                // intentamos tomar el name del objeto
                level = rawLevel.name ?? null;
              } else {
                level = null;
              }

              if (!name) return null;

              return {
                id: l.id ?? idx,
                name,
                level,
              } as NormalizedLanguage;
            })
            .filter(Boolean) as NormalizedLanguage[];

          const normalized: NormalizedDetail = {
            employee_id: p.id,
            profile_image: res.profile_image || null,
            name: res.name,
            description: res.description ?? null,
            age: res.age ?? null,
            approximate_location: res.approximate_location ?? null,
            average_rating: res.average_rating ?? null,
            rating_count: res.rating_count ?? null,
            shiftCards: [],
            applied_shift_ids: [],
            workExperiences: exps,
            educations: edus,
            languages: langs,
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
    return () => {
      mounted = false;
    };
  }, []);

  const goBack = () => router.back();

  const onGenerateOffer = () => {
    let targetId: string | number;

    if (p.source === 'application') {
      // Para postulaciones: seguir usando el ID del turno/aplicación
      const shiftId = data?.applied_shift_ids?.[0] ?? p.id;
      targetId = shiftId as string | number;
    } else {
      // Para búsqueda: usar el ID del empleado
      targetId = (data?.employee_id ?? p.id) as string | number;
    }

    router.push({
      pathname: '/employer/candidates/offer',
      params: {
        source: p.source,
        id: String(targetId),
        ...(p.source === 'search' && p.vacancyId
          ? { vacancyId: String(p.vacancyId) }
          : {}),
        personName: data?.name ?? '',
        photoUrl: data?.profile_image ?? '',
      },
    });
  };

  const shiftSummary = useMemo(
    () => data?.shiftCards?.[0]?.time_range_label ?? '',
    [data?.shiftCards]
  );

  const openConfirmReject = () => setConfirmRejectVisible(true);
  const closeConfirmReject = () => setConfirmRejectVisible(false);
  const confirmReject = async () => {
    try {
      setConfirmRejectVisible(false);
      await requestBackend(`/api/applications/rejected/${p.id}/`, null, 'PUT');
      router.replace('/employer/candidates');
    } catch (e: any) {
      setError(e?.message || 'Error al rechazar la postulación');
    }
  };

  return {
    loading,
    error,
    data,
    shiftSummary,

    goBack,
    onGenerateOffer,

    confirmRejectVisible,
    openConfirmReject,
    closeConfirmReject,
    confirmReject,
  };
};
