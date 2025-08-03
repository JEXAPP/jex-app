import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import useBackendConection from '@/services/useBackendConection';

interface Vacancy {
  vacancy_id: number;       
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

type FilterType = 'role' | 'start_date' | 'event';

export const useSearchVacancy = () => {
  const { requestBackend, loading } = useBackendConection();

  const [search, setSearch] = useState('');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  // 🔹 Filtros y orden
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('role');
  const [selectedOrder, setSelectedOrder] = useState('Mayor pago');

  // 🔹 Paginación
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 Buscar vacantes
  const fetchVacancies = async (reset = false) => {
    if (search.trim() === '') return;

    try {
      const currentOffset = reset ? 0 : offset;

      const response = await requestBackend(
        `/api/vacancies/search/?choice=${selectedFilter}&value=${search}`,
        null,
        'GET'
      );

      console.log(response)

      const results: Vacancy[] = response.data.results || [];
      const count: number = response.data.count || 0;

      if (reset) {
        setVacancies(results);
        setOffset(limit);
        setTotalCount(count);
      } else {
        setVacancies((prev) => [...prev, ...results]);
        setOffset((prev) => prev + limit);
      }

      // 🔹 Actualizamos hasMore en base a count real
      setHasMore(currentOffset + results.length < count);

    } catch (error) {
      console.log('Error al buscar vacantes', error);
    }
  };

  // 🔹 Buscar manual (Enter o cerrar teclado)
  const handleSubmitSearch = () => {
    if (search.trim() === '') return;
    fetchVacancies(true);
  };

  // 🔹 Detectar cierre de teclado
  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (search.trim() !== '') handleSubmitSearch();
    });
    return () => hideListener.remove();
  }, [search]);

  // 🔹 Cambio de orden o filtro
  const handleChangeOrder = (order: string) => {
    setSelectedOrder(order);
    fetchVacancies(true);
  };

  const handleChangeFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
    fetchVacancies(true);
  };

  // 🔹 Scroll infinito
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchVacancies();
    }
  };

  return {
    search,
    setSearch,
    vacancies,
    selectedFilter,
    selectedOrder,
    handleSubmitSearch,
    handleChangeOrder,
    handleChangeFilter,
    handleLoadMore,
    loading,
    hasMore,
    totalCount,
  };
};
