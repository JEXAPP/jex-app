// hooks/employer/useHomeEmployer.ts
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

type VacancyState = 'Activa' | 'En Borrador' | 'Oculta' | 'Llena' | 'Vencida' | 'Eliminada';

type Vacancy = {
  id: number;
  nombre: string;
  estado: VacancyState | string;
};

type EventItem = {
  fechaInicio: string;
  fechaFin: string;
  id: number;
  nombre: string;
  fechaISO: string;
  inicio: string;
  fin: string;
  ubicacion: string;
  vacantes: Vacancy[];
};


const ALL_STATES: VacancyState[] = ['Activa','En Borrador','Oculta','Llena','Vencida','Eliminada'];
const SELECTABLE_STATES = ALL_STATES.filter(s => s !== 'Eliminada'); // para los tags

export const useHomeEmployer = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const [search, _setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<VacancyState | null>(null); 

  useEffect(() => {
    let mounted = true;
    const getVacanciesAndEvents = async () => {
      setLoading(true);
      try {
        const data = await requestBackend('/api/vacancies/by-employer/', null, 'GET');
        console.log('Hola');
        if (!mounted) return;
        const mappedEvents = data.map((evento: any) => {
          const fechaInicio = evento.start_date ? formatearFecha(evento.start_date) : null;
          const fechaFin = evento.end_date ? formatearFecha(evento.end_date) : null;
          return {
            id: evento.id,
            fechaInicio,
            fechaFin,
            nombre: evento.name,
            fechaISO: evento.start_date || '',
            inicio: fechaInicio && evento.start_time
              ? composeFechaHora(fechaInicio, evento.start_time)
              : fechaInicio || 'Sin fecha',
            fin: fechaFin && evento.end_time
              ? composeFechaHora(fechaFin, evento.end_time)
              : fechaFin || 'Sin fecha',
            ubicacion: evento.location || 'Ubicación no definida',
            vacantes: evento.vacancies.map((v: any) => ({
              id: v.id,
              nombre: v.job_type.name === 'Otro' && v.specific_job_type ? v.specific_job_type : v.job_type.name,
              estado: v.state.name,
            })),
          };
        });
        setEvents(mappedEvents);
      } catch (e) {
        console.log('Error al traer los eventos y vacantes:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getVacanciesAndEvents();
    return () => { mounted = false; };
  }, []);

  // eventos ordenados por fecha de inicio
  const orderedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const fechaA = parseFechaISO(a.fechaISO);
      const fechaB = parseFechaISO(b.fechaISO);
      return fechaA.getTime() - fechaB.getTime();
    });
  }, [events]);

  const currentEvent = orderedEvents[currentEventIndex];

  // búsqueda global: al tipear, limpio el estado seleccionado
  const setSearch = (txt: string) => {
    _setSearch(txt);
    if (txt.trim().length > 0) {
      setSelectedState(null); // ⬅️ búsqueda ignora estado
    }
  };

  // filtro + orden
  const filteredVacantes: Vacancy[] = useMemo(() => {
    if (!currentEvent) return [];

    const bySearch = (v: Vacancy) =>
      v.nombre?.toLowerCase().includes(search.toLowerCase());

    const byState = (v: Vacancy) => {
      if (search.trim().length > 0) return true;          // búsqueda ignora estado
      if (!selectedState) return true;                    // sin selección: todas
      return v.estado === selectedState;                  // solo ese estado
    };

    const list = currentEvent.vacantes.filter(bySearch).filter(byState);

    return list.sort((a, b) => {
      return a.nombre.localeCompare(b.nombre)
    });
  }, [currentEvent, search, selectedState]);

  // auxiliares
  function parseFechaISO(fechaISO: string) {
    if (!fechaISO) return new Date(0);
    const [anio, mes, dia] = fechaISO.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }
  function formatearFecha(fecha: string) {
    if (!fecha) return '';
    if (fecha.includes('/')) return fecha;
    if (fecha.includes('-')) { const [y,m,d]=fecha.split('-'); return `${d}/${m}/${y}`; }
    return '';
  }
  function formatearHora(hora?: string) {
    if (!hora) return '';
    const [hh = '00', mm = '00'] = hora.split(':');
    return `${hh.padStart(2,'0')}:${mm.padStart(2,'0')}hs`;
  }
  function composeFechaHora(fecha?: string, hora?: string) {
    const f = formatearFecha(fecha ?? '');
    const h = formatearHora(hora ?? '');
    if (!f && !h) return '';
    if (f && h) return `${f} - ${h}`;
    return f || h;
  }

  const handleNextEvent = () => {
    if (currentEventIndex < orderedEvents.length - 1) setCurrentEventIndex(i => i + 1);
  };
  const handlePrevEvent = () => {
    if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1);
  };

  const goToEditEvent = (id: number) => router.push(`/employer/vacancy/edit-event?id=${id}`);
  const goToCreateEvent = () => router.push('/employer/vacancy/create-event');
  const goToCreateVacancy = (id: number, fechaInicio: string, fechaFin: string) => 
    router.push(`/employer/vacancy/create-vacancy?id=${id}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  const goToVacancyDetail = (vacancyId: number) =>
    router.push(`/employer/vacancy/manipulate-vacancy?id=${vacancyId}`);
  

  return {
    // datos
    currentEvent,
    currentEventIndex,
    events: orderedEvents,
    filteredVacantes,
    loading,

    // navegación
    handleNextEvent,
    handlePrevEvent,
    goToEditEvent,
    goToCreateEvent,
    goToCreateVacancy,
    goToVacancyDetail,

    // búsqueda
    search, setSearch,

    // estados (tags)
    selectableStates: SELECTABLE_STATES,
    selectedState, setSelectedState,
  };
};
