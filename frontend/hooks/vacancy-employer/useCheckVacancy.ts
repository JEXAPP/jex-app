import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import useBackendConection from '@/services/useBackendConection';

export const useCheckVacancy = () => {
  const router = useRouter();
  const { requestBackend, loading } = useBackendConection();

  const [events, setEvents] = useState<any[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showPublished, setShowPublished] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const getVacanciesAndEvents = async () => {
      try {
        const data = await requestBackend('/api/vacancies/by-employer/', null, 'GET');
        console.log('Eventos y Vacantes:', data.results);

        const mappedEvents = data.results.map((evento: any) => {
          // Forzamos que la fecha venga como string válido
          const fechaInicio = evento.start_date ? formatearFecha(evento.start_date) : null;
          const fechaFin = evento.end_date ? formatearFecha(evento.end_date) : null;

          console.log('Evento ->', evento.name, 'fechaInicio:', fechaInicio, 'fechaFin:', fechaFin);

          return {
            id: evento.id,
            nombre: evento.name,
            fechaISO: evento.start_date || '', // Usamos start_date para ordenar
            fecha:
              fechaInicio && fechaFin && fechaInicio !== fechaFin
                ? `${fechaInicio} - ${fechaFin}`
                : fechaInicio || fechaFin || 'Sin fecha',
            horario:
              evento.start_time && evento.end_time
                ? `${evento.start_time}hs - ${evento.end_time}hs`
                : 'Horario no definido',
            ubicacion: evento.location || 'Ubicación no definida',
            vacantes: evento.vacancies.map((v: any) => ({
              id: v.id,
              nombre:
                v.job_type.name === 'Otro' && v.specific_job_type
                  ? v.specific_job_type
                  : v.job_type.name,
              estado: v.state.name,
            })),
          };
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error al traer los eventos y vacantes:', error);
      }
    };

    getVacanciesAndEvents();
  }, []);

  // Ordenar por fecha de inicio
  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const fechaA = parseFechaISO(a.fechaISO);
      const fechaB = parseFechaISO(b.fechaISO);
      return fechaA.getTime() - fechaB.getTime();
    });
  }, [events]);

  const currentEvent = orderedEvents[currentEventIndex];

  // Filtrar vacantes según estado y búsqueda
  const filteredVacantes = useMemo(() => {
    if (!currentEvent) return [];
    return currentEvent.vacantes
      .filter((v) => (showPublished ? v.estado === 'Activa' : v.estado !== 'Activa'))
      .filter((v) => v.nombre.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortAsc ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre),
      );
  }, [currentEvent, search, showPublished, sortAsc]);

  // Auxiliares
  function parseFechaISO(fechaISO: string) {
    if (!fechaISO) return new Date();
    const [anio, mes, dia] = fechaISO.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  function formatearFecha(fecha: string) {
  // Si viene como DD/MM/YYYY
  if (fecha.includes('/')) {
    const [dia, mes, anio] = fecha.split('/');
    return `${dia}/${mes}/${anio}`; // ya está en el formato correcto
  }

  // Si viene como YYYY-MM-DD (por compatibilidad futura)
  if (fecha.includes('-')) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  return '';
}

  const handleNextEvent = () => {
    if (currentEventIndex < orderedEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  const goToEditEvent = () => router.push('/create-vacant');
  const goToCreateEvent = () => router.push('/create-event');
  const goToCreateVacancy = () => router.push('/create-vacant');
  const goToVacancyDetail = (vacancyId: number) => router.push(`/create-vacant`);

  return {
    currentEvent,
    currentEventIndex,
    events: orderedEvents,
    loading,
    handleNextEvent,
    handlePrevEvent,
    search,
    setSearch,
    showPublished,
    setShowPublished,
    sortAsc,
    setSortAsc,
    filteredVacantes,
    goToEditEvent,
    goToCreateEvent,
    goToCreateVacancy,
    goToVacancyDetail,
  };
};
