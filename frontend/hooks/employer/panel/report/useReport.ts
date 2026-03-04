import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

export type PaymentStatus = 'NO_PAYMENT' | 'APPROVED' | 'PENDING' | 'FAILURE';

export type EmployeeItem = {
  employee_id: number;
  employee_name: string;
  attendance: boolean;
  payment_status: PaymentStatus;
  rating: number | null;
  profile_image_url: string | null;
  job_type: string | null;
};

type EventReportResponse = {
  id: number;
  name: string;
  total_offers_accepted: number;
  total_attendances_confirmed: number;
  total_payments_approved: number;
  employees: EmployeeItem[];
};

export const useEventReport = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const eventId = params?.id ? Number(params.id) : undefined;
  const fallbackName = params?.name ? String(params.name) : undefined;

  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EventReportResponse | null>(null);

  const fetchReport = useCallback(async () => {
    if (!eventId) {
      setError('Falta el parámetro "id" del evento');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await requestBackend(`/api/events/${eventId}/report/`, null, 'GET');
      const report: EventReportResponse = {
        name: fallbackName ?? res?.name ?? `Evento #${eventId}`,
        ...res,
      };
      setData(report);
    } catch (e) {
      console.log('Error al obtener reporte del evento:', e);
      setError('No se pudo cargar el reporte');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const derived = useMemo(() => {
    if (!data) {
      return {
        paymentCounts: { NO_PAYMENT: 0, APPROVED: 0, PENDING: 0, FAILURE: 0 } as Record<PaymentStatus, number>,
        ratingBuckets: [0, 0, 0, 0, 0],
        avgRating: 0,
        byRole: [] as Array<{ role: string; attended: number; notAttended: number; total: number }>,
        accepted: 0,
        confirmed: 0,
        approved: 0,
        eventName: '',
        employees: [] as EmployeeItem[],
      };
    }

    const { employees, total_offers_accepted, total_attendances_confirmed, total_payments_approved } = data;

    // Pagos
    const paymentCounts = employees.reduce(
      (acc, e) => {
        acc[e.payment_status] = (acc[e.payment_status] || 0) + 1;
        return acc;
      },
      { NO_PAYMENT: 0, APPROVED: 0, PENDING: 0, FAILURE: 0 } as Record<PaymentStatus, number>
    );

    // Rating buckets 1..5
    const ratingBuckets = [0, 0, 0, 0, 0];
    let ratingSum = 0;
    employees.forEach(e => {
      const safeRating = e.rating ?? 0;

      const r = Math.round(safeRating);
      const idx = Math.min(Math.max(r, 1), 5) - 1;

      ratingBuckets[idx] += 1;
      ratingSum += safeRating;
    });
    const avgRating = employees.length ? ratingSum / employees.length : 0;

    // Agrupamiento por rol
    const roleMap = new Map<string, { attended: number; notAttended: number }>();
    employees.forEach(e => {
      const role = e.job_type || 'Sin rol';
      const rec = roleMap.get(role) || { attended: 0, notAttended: 0 };
      if (e.attendance) rec.attended += 1;
      else rec.notAttended += 1;
      roleMap.set(role, rec);
    });
    const byRole = Array.from(roleMap.entries()).map(([role, { attended, notAttended }]) => ({
      role,
      attended,
      notAttended,
      total: attended + notAttended,
    }));

    const accepted = total_offers_accepted ?? employees.length;
    const confirmed = total_attendances_confirmed ?? 0;
    const approved = total_payments_approved ?? 0;

    return {
      paymentCounts,
      ratingBuckets,
      avgRating,
      byRole,
      accepted,
      confirmed,
      approved,
      eventName: data.name,
      employees,
    };
  }, [data]);

  const goBack = () => router.back();

  return {
    loading,
    error,
    data,
    ...derived,
    refresh: fetchReport,
    goBack,
  };
};
