import { Vacancy } from '@/constants/interfaces';
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

type FilterType = 'role' | 'date' | 'event';

export const ORDERING_MAP: Record<string, string> = {
  'Fecha más reciente': 'start_date_desc',
  'Fecha más lejana': 'start_date_asc',
  'Mayor pago': 'payment_desc',
  'Menor pago': 'payment_asc',
  'Rol A-Z': 'role_asc',
  'Rol Z-A': 'role_desc',
};

type Suggestion = { id: number; label: string };
type Option = { id: string | number; label: string; value: string | number };

export const useSearchVacancy = () => {
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  // valores ingresados desde el input (textos o fechas en D/M/Y)
  const [searchValues, setSearchValues] = useState<(string | number)[]>([]);
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('role');
  const [selectedOrder, setSelectedOrder] = useState('Mayor pago');

  const [roles, setRoles] = useState<Suggestion[]>([]);
  const rolesLoaded = useRef(false);
  const [hasSearched, setHasSearched] = useState(false);

  // paginación
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(false); // búsqueda nueva / cambio de orden o filtro
  const [isLoadingMore, setIsLoadingMore] = useState(false);           // paginación

  // carga de roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (rolesLoaded.current) return;
      try {
        const data = await requestBackend('/api/vacancies/job-types/', null, 'GET');
        setRoles((data as any[]).map(r => ({ id: r.id, label: r.name })));
        rolesLoaded.current = true;
      } catch (error) {
        console.log('Error al cargar roles', error);
      }
    };
    fetchRoles();
  }, []);

  // sugerencias (1 char)
  const fetchSuggestions = async (query: string) => {
    const q = query.trim();
    if (q.length < 1) { setSuggestions([]); return; }

    if (selectedFilter === 'role') {
      const nq = normalize(q);
      const list = roles
        .filter(r => normalize(r.label).includes(nq))
        .map<Option>(r => ({ id: r.id, label: r.label, value: r.label }));
      setSuggestions(list);
      return;
    }

    if (selectedFilter === 'event') {
      
      try {
        const data = await requestBackend(
          `/api/vacancies/suggestions/events?q=${encodeURIComponent(q)}`,
          null,
          'GET'
        );
        const results = (data as any)?.results ?? [];
        const list: Option[] = results.map((it: any) => ({
          id: it.id,
          label: it.name,
          value: it.name,
        }));
        setSuggestions(list);
      } catch (error) {
        console.log('Error al obtener sugerencias de eventos', error);
        setSuggestions([]);
      }
      return;
    }

    setSuggestions([]);
  };

  // request principal
  const fetchVacancies = async (
    reset = false,
    valuesOverride?: (string | number)[],
    orderOverride?: string
  ) => {
    const activeVals = valuesOverride ?? searchValues;
    if (activeVals.length === 0) return;

    if (reset) {
      setIsLoadingFirstPage(true);
      setIsLoadingMore(false);
      setVacancies([]);     // limpieza inmediata: que se vea solo el skeleton de pantalla
      setPage(1);
      setHasMore(true);
      setTotalCount(0);
    } else {
      if (isLoadingFirstPage || isLoadingMore || !hasMore) return;
      setIsLoadingMore(true);
    }

    try {
      const currentPage = reset ? 1 : page;
      const orderKey = ORDERING_MAP[orderOverride ?? selectedOrder];
      let url = `/api/vacancies/search/?choice=${selectedFilter}&order_by=${orderKey}&page=${currentPage}&page_size=${pageSize}`;
      
      if (selectedFilter === 'date') {
        // SOLUCIÓN: no usar encodeURIComponent en fechas (evita 28%2F08%2F2025)
        const from = String(activeVals[0] ?? '').trim(); // DD/MM/YYYY
        const to   = String(activeVals[1] ?? '').trim(); // DD/MM/YYYY (opcional)
        url += `&date_from=${from}`;
        if (to) url += `&date_to=${to}`;
        } else {
          // Un value= por cada chip (rol/evento)
          const parts = activeVals
            .map(v => String(v).trim())
            .filter(Boolean)
            .map(v => `&value=${encodeURIComponent(v)}`)
            .join('');
          url += parts;
        }
      console.log(url)
      const data = await requestBackend(url, null, 'GET');
      const results: Vacancy[] = (data as any).results ?? [];
      const count: number = (data as any).count ?? 0;

      if (reset) {
        setVacancies(results);
        setPage(2);
        setTotalCount(count);
      } else {
        setVacancies(prev => [...prev, ...results]);
        setPage(prev => prev + 1);
      }

      const fetched = (reset ? 0 : vacancies.length) + results.length;
      setHasMore(fetched < count);
    } catch (error) {
      console.log('Error al buscar vacantes', error);
      setHasMore(false);
    } finally {
      if (reset) setIsLoadingFirstPage(false);
      else setIsLoadingMore(false);
    }
  };

  // entrada desde SearchInput
  const handleSubmitSearch = (values: (string | number)[]) => {
    setHasSearched(true);
    // guardamos tal cual: textos o fechas DD/MM/YYYY
    const clean = Array.from(
      new Set(values.map(v => String(v).trim()).filter(Boolean))
    );
    setSearchValues(clean);
    fetchVacancies(true, clean);
  };

  const handleChangeOrder = (order: string) => {
    setSelectedOrder(order);
    if (searchValues.length > 0) fetchVacancies(true, searchValues, order)
  };

  const handleChangeFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
    setSuggestions([]);
    setSearchValues([]);
    setVacancies([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    setHasSearched(false)
  };

  const handleLoadMore = () => {
    if (!isLoadingFirstPage && !isLoadingMore && hasMore) {
      fetchVacancies(false, searchValues);
    }
  };

  const opciones =
    selectedFilter === 'date'
      ? ['Fecha más reciente', 'Fecha más lejana', 'Mayor pago', 'Menor pago']
      : ['Rol A-Z', 'Rol Z-A', 'Mayor pago', 'Menor pago'];

  const goToVacancyDetails = (vacancy: Vacancy) => {
    router.push(`/employee/vacancy/apply-vacancy?id=${vacancy.vacancy_id}`);
  };

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  return {
    opciones,
    searchIds: searchValues,
    setSearchIds: setSearchValues,
    suggestions,
    fetchSuggestions,
    vacancies,
    selectedFilter,
    selectedOrder,
    handleSubmitSearch,
    handleChangeOrder,
    handleChangeFilter,
    handleLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
    hasMore,
    totalCount,
    goToVacancyDetails,
    hasSearched
  };
};
