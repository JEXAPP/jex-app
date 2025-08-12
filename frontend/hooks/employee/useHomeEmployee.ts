import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';


interface Vacancy {
  vacancy_id: number;
  event_name: string;
  start_date: string;
  payment: string;
  job_type_name: string;
  specific_job_type?: string | null;
  image_url?: string | null;
}

export const useHomeEmployee = () => {
  const router = useRouter();
  // Hook para manejar la conexión con el backend
  const { requestBackend} = useBackendConection();
  const { validateToken } = useTokenValidations()
  const [loadingComienzo, setLoadingComienzo] = useState<boolean>(true)
  const [soonVacancies, setSoonVacancies] = useState<Vacancy[]>([]);
  const [interestVacancies, setInterestVacancies] = useState<Vacancy[]>([]);
  const [nearVacancies, setNearVacancies] = useState<Vacancy[]>([]);
  const [errorVacancies, setErrorVacancies] = useState<string | null>(null);

  const fetchVacancies = async () => {
    try {
      const [soon, interests, near] = await Promise.all([
        requestBackend('/api/vacancies/list/?category=soon', null, 'GET'),
        requestBackend('/api/vacancies/list/?category=interests', null, 'GET'),
        requestBackend('/api/vacancies/list/?category=nearby', null, 'GET'),
      ]);

      setSoonVacancies(soon?.results);
      setInterestVacancies(interests?.results);
      setNearVacancies(near?.results);
      setLoadingComienzo(false)
    } catch (err) {
      console.log('Error al obtener vacantes:', err);
      setErrorVacancies('No se pudieron cargar las vacantes');
  }};

  useEffect(() => {
    validateToken('employee')
    fetchVacancies();
  }, []);

  /** Función al presionar la tarjeta de una vacante */
  const goToVacancyDetails = (vacancy: Vacancy) => {
    router.push(`./employee/vacancy/apply-vacancy?id=${vacancy.vacancy_id}`);
  };


  /** Funciones al presionar los títulos */
  const goToSoonList = () => router.push('/');
  const goToInterestList = () => router.push('/');
  const goToNearList = () => router.push('/');
  const goToSearchVacancy = () => router.push('/employee/vacancy/search-vacancy')

  return {
    soonVacancies,
    interestVacancies,
    nearVacancies,
    loadingComienzo,
    errorVacancies,
    goToVacancyDetails,
    goToSoonList,
    goToInterestList,
    goToNearList,
    goToSearchVacancy
  };
};
