import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

export type CategoryKey = 'soon' | 'nearby' | 'interests';

export interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

type ApiItem = {
  event: string;
  vacancy_id: number;
  job_type_name: string;
  payment: string;
  specific_job_type?: string | null;
  start_date: string;
};
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
    const [totalCount, setTotalCount] = useState(0);
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

        const results: ApiItem[] = (data?.results ?? []);
        const count: number = data?.count ?? 0;

        const mapped: Vacancy[] = results.map((it) => ({
        vacancy_id: it.vacancy_id,
        event_name: it.event,
        job_type_name: it.job_type_name,
        payment: it.payment,
        specific_job_type: it.specific_job_type ?? null,
        start_date: it.start_date,
        image_url: null,
        }));

        if (reset) {
        setVacancies(mapped);
        setPage(2);
        setTotalCount(count);
        setHasMore(mapped.length < count);
        } else {
        setVacancies((prev) => [...prev, ...mapped]);
        const fetched = (vacancies.length + mapped.length);
        setPage((p) => p + 1);
        setTotalCount(count);
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
    setTotalCount(0);
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
