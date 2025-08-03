// hooks/employee/useHomeScreenEmployee.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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

export const useHomeScreenEmployee = () => {
  const router = useRouter();
  // Hook para manejar la conexión con el backend
  const { requestBackend, loading } = useBackendConection();

  const [soonVacancies, setSoonVacancies] = useState<Vacancy[]>([]);
  const [interestVacancies, setInterestVacancies] = useState<Vacancy[]>([]);
  const [nearVacancies, setNearVacancies] = useState<Vacancy[]>([]);
  const [errorVacancies, setErrorVacancies] = useState<string | null>(null);

  const fetchVacancies = async () => {
    try {
      const [soon, interests, near] = await Promise.all([
        requestBackend('/api/vacancies/list/?category=soon', null, 'GET'),
        requestBackend('/api/vacancies/list/?category=interests', null, 'GET'),
        requestBackend('vacancies/list/?category=nearby', null, 'GET'),
      ]);

      setSoonVacancies(soon?.results);
      setInterestVacancies(interests?.results);
      setNearVacancies(near?.results);
    } catch (err) {
      console.error('Error al obtener vacantes:', err);
      setErrorVacancies('No se pudieron cargar las vacantes');
  }};

  useEffect(() => {
    fetchVacancies();
  }, []);

  /** Función al presionar la tarjeta de una vacante */
  const goToVacancyDetails = (vacancy: Vacancy) => {
    router.push({
      pathname: '/login',
      params: { id: vacancy.vacancy_id.toString() },
    });
  };

  const goToSearchVacancy = () => router.push('/employee/search-vacancy');

  /** Funciones al presionar los títulos */
  const goToSoonList = () => router.push('/login');
  const goToInterestList = () => router.push('/login');
  const goToNearList = () => router.push('/login');

  return {
    soonVacancies,
    interestVacancies,
    nearVacancies,
    loading,
    errorVacancies,
    goToSearchVacancy,
    goToVacancyDetails,
    goToSoonList,
    goToInterestList,
    goToNearList,
  };
};
