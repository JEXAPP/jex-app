import useBackendConection from '@/services/internal/useBackendConection';
import { useEffect, useRef, useState } from 'react';

interface Vacancy {
  id: number;       
  event: string;
  start_date: string;
  payment: string;
  job_type: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

type FilterType = 'role' | 'start_date' | 'event';

export const ORDERING_MAP: Record<string, string> = {
  "Fecha más reciente": "start_date_desc",
  "Fecha más lejana": "start_date_asc",
  "Mayor pago": "payment_desc",
  "Menor pago": "payment_asc",
  "Rol A-Z": "role_asc",
  "Rol Z-A": "role_desc",
};

interface Suggestion {
  id: number | string;
  label: string;
}

export const useSearchVacancy = () => {
  const { requestBackend } = useBackendConection();

  const [searchIds, setSearchIds] = useState<(string | number)[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('role');
  const [selectedOrder, setSelectedOrder] = useState('Mayor pago');

  const [roles, setRoles] = useState<Suggestion[]>([]);
  const rolesLoaded = useRef(false);

  // Paginación
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Evitar requests simultáneos
  const [isFetching, setIsFetching] = useState(false);

  // 🔹 Cargar roles una sola vez
  useEffect(() => {
    const fetchRoles = async () => {
      if (rolesLoaded.current) return;
      try {
        const response = await requestBackend('/api/vacancies/job-types/', null, 'GET');
        setRoles(response.map((r: any) => ({ id: r.id, label: r.name })));
        rolesLoaded.current = true;
      } catch (error) {
        console.log('Error al cargar roles', error);
      }
    };
    fetchRoles();
  }, []);

  // 🔹 Obtener sugerencias dinámicas
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (selectedFilter === 'role') {
      // Filtrado en frontend
      const filtered = roles.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      return;
    }

    if (selectedFilter === 'event') {
      try {
        const response = await requestBackend(
          `/api/vacancies/suggestions/events?q=${query}`,
          null,
          'GET'
        );
        const results = response.data.results || [];
        setSuggestions(results.map((item: any) => ({ id: item.id, label: item.name })));
      } catch (error) {
        console.log('Error al obtener sugerencias de eventos', error);
      }
    }
  };

  // 🔹 Buscar vacantes con control de paginación
  const fetchVacancies = async (reset = false) => {
    if (searchIds.length === 0 || isFetching) return;

    setIsFetching(true);
    try {
      const currentPage = reset ? 1 : page;

      const response = await requestBackend(
        `/api/vacancies/search/?choice=${selectedFilter}&value=[${searchIds}]&order_by=${ORDERING_MAP[selectedOrder]}&page=${currentPage}&page_size=${pageSize}`,
        null,
        'GET'
      );

      const results: Vacancy[] = response.results || [];
      const count: number = response.count || 0;

      if (reset) {
        setVacancies(results);
        setPage(2);
        setTotalCount(count);
      } else {
        setVacancies((prev) => [...prev, ...results]);
        setPage((prev) => prev + 1);
      }

      // 🔹 Verificamos si quedan más registros
      const totalFetched = (reset ? results.length : vacancies.length + results.length);
      setHasMore(totalFetched < count);

    } catch (error) {
      console.log('Error al buscar vacantes', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitSearch = (ids: (string | number)[]) => {
    setSearchIds(ids);
    if (ids.length > 0) fetchVacancies(true);
  };

  const handleChangeOrder = (order: string) => {
    setSelectedOrder(order);
    fetchVacancies(true);
  };

  const handleChangeFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
    setSuggestions([]);
    setSearchIds([]);
    setVacancies([]);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
  };

  const handleLoadMore = () => {
    // 🔹 Solo carga si hay más y no está cargando
    if (!isFetching && hasMore) {
      fetchVacancies();
    }
  };

  return {
    searchIds,
    setSearchIds,
    suggestions,
    fetchSuggestions,
    vacancies,
    selectedFilter,
    selectedOrder,
    handleSubmitSearch,
    handleChangeOrder,
    handleChangeFilter,
    handleLoadMore,
    isFetching,
    hasMore,
    totalCount,
  };
};
