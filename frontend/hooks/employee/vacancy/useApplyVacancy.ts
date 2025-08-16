import useBackendConection from '@/services/internal/useBackendConection';
import { useDataTransformation } from '@/services/internal/useDataTransformation';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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

export const useApplyVacancy = () => {

  const { id } = useLocalSearchParams();
  const idVancancy = Number(id)
  const { requestBackend } = useBackendConection();
   const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {formatFechaLarga, formatFechaCorta} = useDataTransformation()
  const { validateToken } = useTokenValidations()
  const [job, setJob] = useState<Job | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [turnos, setTurnos] = useState<Shift[]>([]);
  const [turnosSeleccionados, setTurnosSeleccionados] = useState<number[]>([]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    validateToken('employee')
    fetchJobData();
  }, []);

  useEffect(() => {
    if (turnos.length === 1 && turnos[0].turnos.length === 1) {
      const turnoUnicoId = turnos[0].turnos[0].id;
      setTurnosSeleccionados([turnoUnicoId]);
    }
  }, [turnos]); // se ejecuta después de cargar los turnos

  const handleToggleTurnos = (id: number) => {
    const haySoloUnTurno = turnos.length === 1 && turnos[0].turnos.length === 1;
    if (haySoloUnTurno) return; 
    setTurnosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const salarioAMostrar = () => {
    if (turnosSeleccionados.length === 0) return 'Elegí un turno';

    const salarios = turnos
      .flatMap(t => t.turnos)
      .filter(t => turnosSeleccionados.includes(t.id))
      .map(t => Number(t.paga.replace(/\D/g, ''))); // solo números

    const mayorSalario = Math.max(...salarios);
    return `${mayorSalario.toLocaleString('es-AR')} ARS`;
  }

  const fetchJobData = async () => {
    setLoading(true)
    try {
      const vacante = await requestBackend(`/api/vacancies/${idVancancy}/details`, null, 'GET');

      setJob({
        title: vacante.event.name,
        description: vacante.description,
        role: vacante.job_type,
        date: formatFechaLarga(vacante.shifts[0]?.start_date),
        time: `${vacante.shifts[0]?.start_time} a ${vacante.shifts[0]?.end_time}`,
        requirements: (vacante.requirements as Requirement[]).map(r => `${r.description}`),
        salary: `${vacante.shifts[0]?.payment ?? ''} ARS`,
        deadline: formatFechaCorta(vacante.shifts[0]?.end_date),
        mapImage: require('@/assets/images/maps.png'),
        rating: 4.0,
      });

      setOrganizer({
        name: `${vacante.event.owner.first_name} ${vacante.event.owner.last_name}`,
        reviews: 13,
        rating: 4.2,
        jexTime: '1 año'
      });

      setTurnos(
        vacante.shifts.map((shift: any) => ({
          id: shift.id,
          dia: formatFechaLarga(shift.start_date),
          turnos: [
            {
              id: shift.id,
              horario: `${shift.start_time.substring(0, 5)} a ${shift.end_time.substring(0, 5)}`,
              paga: `${shift.payment.slice(0, -3)} ARS`,
            }
          ]
        }))
      );

    } catch (err) {

      console.log('Hubo un error al cargar los datos:', err)
      setErrorMessage('Error al cargar los datos del trabajo');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {

    setLoading(true)
    try {
      const payload = {
        vacancy_id: idVancancy,
        shifts: turnosSeleccionados
      };
      await requestBackend('/api/applications/apply/', payload, 'POST');
      setShowSuccess(true);

      setTimeout(() => {
        router.replace('/employee')
        setShowSuccess(false);
      }, 1500);

    } catch (err) {
      console.log('Error al postularse:', err);
      setErrorMessage('Hubo un problema al postularte. Intentá nuevamente.');
      setShowError(true);
    } finally {
      setLoading(false);
    } 
    
  };

  const closeSuccess = () => {
    router.replace('/employee')
  }

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
    showSuccess,
    setShowSuccess,
    loading,
    salarioAMostrar: salarioAMostrar(),
    turnoSeleccionadoValido: turnosSeleccionados.length > 0,
    closeSuccess
  };
};

