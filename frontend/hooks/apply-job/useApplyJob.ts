import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/useBackendConection';
import { formatFecha } from '../formatFecha';

interface Requirement {
  description: string;
}

interface Shift {
  id: number;
  dia: string;
  turnos: {
    id: number;
    horario: string;
    paga: string;
  }[];
}

interface Job {
  title: string;
  description: string;
  role: string;
  date: string;
  time: string;
  requirements: string[];
  salary: string;
  deadline: string;
  mapImage: string;
  rating: number;
}

interface Organizer {
  name: string;
  reviews: number;
  rating: number;
  jexTime: string;
}

export const useApplyJob = () => {
  const { id } = useLocalSearchParams();
  const idVancancy = Number(id)
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [turnos, setTurnos] = useState<Shift[]>([]);
  const [turnosSeleccionados, setTurnosSeleccionados] = useState<number[]>([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorTemp, setShowErrorTemp] = useState(false);

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchJobData = async () => {
    try {
      const vacante = await requestBackend(`/api/vacancies/${idVancancy}/details`, null, 'GET');
      console.log('DATOS ', vacante);

      setJob({
        title: vacante.event.name,
        description: vacante.description,
        role: vacante.job_type,
        date: formatFecha(vacante.shifts[0]?.start_date),
        time: `${vacante.shifts[0]?.start_time} a ${vacante.shifts[0]?.end_time}`,
        requirements: (vacante.requirements as Requirement[]).map(r => `${r.description}`),
        salary: `${vacante.shifts[0]?.payment ?? ''}`,
        deadline: formatFecha(vacante.shifts[0]?.end_date),
        mapImage: require('@/assets/images/maps.png'),
        rating: 4.0,
      });

      setOrganizer({
        name: `${vacante.event.owner.first_name} ${vacante.event.owner.last_name}`,
        reviews: 13,
        rating: 4.2,
        jexTime: '1 año'
      });
      console.log('DATOS ', vacante.event.owner);

      setTurnos(
        vacante.shifts.map((shift: any) => ({
          id: shift.id,
          dia: formatFecha(shift.start_date),
          turnos: [
            {
              id: shift.id,
              horario: `${shift.start_time.substring(0, 5)} a ${shift.end_time.substring(0, 5)}`,
              paga: `$${shift.payment}`,
            }
          ]
        }))
      );

    } catch (err) {
      setErrorMessage('Error al cargar los datos del trabajo');
      setShowError(true);
    }
  };

  const handleToggleTurnos = (id: number) => {
    setTurnosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApply = async () => {
    try {
      const payload = {
        vacancy_id: idVancancy,
        shifts: turnosSeleccionados
      };
      console.log(payload);

      await requestBackend('/api/applications/apply/', payload, 'POST');
      setShowSuccess(true);
      setTimeout(() => {
      }, 2500);
    } catch (err) {
      console.error('Error al postularse:', err);
      setErrorMessage('Hubo un problema al postularte. Intentá nuevamente.');
      setShowError(true);
      setShowErrorTemp(true);
    }
  };

  return {
    job,
    organizer,
    handleApply,
    turnos,
    turnosSeleccionados,
    handleToggleTurnos,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    showSuccess,
    setShowSuccess,
    showErrorTemp,
    setShowErrorTemp,
  };
};

