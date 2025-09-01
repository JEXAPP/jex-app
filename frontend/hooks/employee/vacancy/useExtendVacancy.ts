import { Vacancy } from '@/constants/interfaces';
import useBackendConection from '@/services/internal/useBackendConection';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

export type CategoryKey = 'soon' | 'nearby' | 'interests';

export const useExtendVacancy = () => {

    const router = useRouter();

    const { category } = useLocalSearchParams<{ category?: string }>();
    const cat = String(category || '').toLowerCase() as CategoryKey;

    // --- Título con if simple ---
    let title = 'Próximamente';
    if (cat === 'nearby') {
    title = 'Cerca de tu Zona';
    } else if (cat === 'interests') {
    title = 'Según tus intereses';
    }

    const { requestBackend } = useBackendConection();

    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const pageSize = 10;
    const mounted = useRef(false);

    const fetchVacancies = async (reset = false) => {
    if (!cat || (cat !== 'soon' && cat !== 'nearby' && cat !== 'interests')) return;
    if (isFetching) return;

    setIsFetching(true);
    try {
        const currentPage = reset ? 1 : page;
        const url =
        `/api/vacancies/list/?category=${encodeURIComponent(cat)}` +
        `&page=${currentPage}&page_size=${pageSize}`;

        const data = await requestBackend(url, null, 'GET');
        const results: Vacancy[] = (data?.results ?? []);
        const count: number = data?.count ?? 0;
        if (reset) {
          setVacancies(results);
          setPage(2);
          setHasMore(results.length < count);
        } else {
          setVacancies((prev) => [...prev, ...results]);
          const fetched = (vacancies.length + results.length);
          setPage((p) => p + 1);
          setHasMore(fetched < count);
        }
    } catch (e) {
        console.log('Error al listar por categoría', e);
        setHasMore(false);
    } finally {
        setIsFetching(false);
    }
    };

    const handleLoadMore = () => {
      if (!isFetching && hasMore) fetchVacancies(false);
    };

    useEffect(() => {
      if (!mounted.current) mounted.current = true;
      setVacancies([]);
      setPage(1);
      setHasMore(true);
      fetchVacancies(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cat]);

    const goToVacancyDetails = (vacancy: Vacancy) => {
    router.push(`/employee/vacancy/apply-vacancy?id=${vacancy.vacancy_id}`);
  };

    return {
    title,
    vacancies,
    isFetching,
    handleLoadMore,
    goToVacancyDetails
    };
};
