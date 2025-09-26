import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';

type EmployeeItem = {
  employee_id: number;
  profile_image: string | null;
  name: string;
  approximate_location: string | null;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeItem[];
};

const PAGE_SIZE = 10;

// Completa tiempos si hay fechas (día único por defecto)
function ensureTimes(q: Record<string, any>) {
  if (q.start_date && !q.end_date) q.end_date = q.start_date;
  if ((q.start_date || q.end_date) && !q.start_time) q.start_time = '00:00';
  if ((q.start_date || q.end_date) && !q.end_time) q.end_time = '23:59';
  return q;
}

export const useSearchEmployeesResults = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateToken } = useTokenValidations();
  const raw = useLocalSearchParams();

  const queryBase = useMemo(() => {
    const q = ensureTimes({
      province: raw.province ?? '',
      locality: raw.locality ?? '',
      start_date: raw.start_date ?? '',
      end_date: raw.end_date ?? '',
      start_time: raw.start_time ?? '',
      end_time: raw.end_time ?? '',
      min_jobs: raw.min_jobs ?? '',
      min_rating: raw.min_rating ?? '',
    });
    Object.keys(q).forEach(k => (q[k] === '' || q[k] == null) && delete q[k]);
    return q;
  }, [raw]);

  const [items, setItems] = useState<EmployeeItem[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const hasNext = useMemo(() => page * PAGE_SIZE < count, [page, count]);

  const buildUrl = useCallback((pageNum: number) => {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(queryBase)) usp.append(k, String(v));
    usp.append('page', String(pageNum));
    usp.append('page_size', String(PAGE_SIZE));
    return `/api/applications/employees/search/?${usp.toString()}`;
  }, [queryBase]);

  const fetchPage = useCallback(async (pageNum: number, mode: 'reset' | 'append' = 'reset') => {
    mode === 'reset' ? setLoading(true) : setLoadingMore(true);
    try {
      const res: ApiResponse = await requestBackend(buildUrl(pageNum), null, 'GET');
      if (!res) throw new Error('Respuesta vacía');
      setCount(res.count ?? 0);
      setItems(prev => (mode === 'reset' ? res.results : [...prev, ...res.results]));
      setPage(pageNum);
      setErrorMsg(null);
    } catch (err) {
      console.log('Error al buscar empleados:', err);
      setErrorMsg('No se pudieron cargar los resultados');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [buildUrl, requestBackend]);

  const reload = useCallback(() => { setRefreshing(true); fetchPage(1, 'reset'); }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasNext) fetchPage(page + 1, 'append');
  }, [fetchPage, hasNext, loadingMore, page]);

  const goBack = useCallback(() => router.back(), [router]);

  const onPressEmployee = useCallback((employeeId: number) => {
    router.push({ pathname: '/employer/candidates/detail', params: { source: 'search', id: String(employeeId) } });
  }, [router]);

  useEffect(() => {
    validateToken('employer');
    fetchPage(1, 'reset');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // data
    items, count, loading, loadingMore, refreshing, errorMsg,
    // actions
    reload, loadMore, goBack, onPressEmployee,
  };
};
