import useBackendConection from '@/services/internal/useBackendConection';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type Turno = {
  fechaInicio: Date;
  horaInicio: string;
  fechaFin: Date;
  horaFin: string;
  pago: string;
  cantidad: string;
};

type Vacante = {
  rol: string;
  rolNombre: string;
  otrosRol: string;
  descripcion: string;
  requerimientos: string[];
  turnos: Turno[];
};

export const useEditVacancy = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const idVacancy = Number(id)
  const { requestBackend } = useBackendConection();

  const [vacante, setVacante] = useState<Vacante | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rolesDisponibles, setRolesDisponibles] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await requestBackend(`/api/vacancies/${idVacancy}/details`, null, 'GET');
        const roles = await requestBackend('/api/vacancies/job-types', null, 'GET');
        setRolesDisponibles(roles);

        const turnos = data.shifts.map((t: any) => ({
          fechaInicio: new Date(t.start_date),
          horaInicio: t.start_time.slice(0, 5),
          fechaFin: new Date(t.end_date),
          horaFin: t.end_time.slice(0, 5),
          pago: t.payment.toLocaleString('es-AR'),
          cantidad: t.quantity.toString(),
        }));

        setVacante({
          rol: data.job_type === 'Otro'
            ? 'otro'
            : roles.find((r: { id: number; name: string }) => r.name === data.job_type)?.id?.toString() ?? '',
          rolNombre: data.job_type,
          otrosRol: data.specific_job_type || '',
          descripcion: data.description,
          requerimientos: data.requirements.map((r: any) => r.description),
          turnos,
        });

        setLoading(false);
      } catch (error: any) {
        setErrorMessage('Error al cargar los datos');
        setShowError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const actualizarCampo = (campo: string, valor: any) => {
    setVacante((prev) => prev ? { ...prev, [campo]: valor } : prev);
  };

  const actualizarTurno = (index: number, campo: string, valor: any) => {
    if (!vacante) return;
    const nuevos = [...vacante.turnos];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setVacante({ ...vacante, turnos: nuevos });
  };

  const formatearFecha = (fecha: Date | null): string => {
  if (!fecha || isNaN(fecha.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(fecha);
};


  const actualizarRequerimiento = (index: number, texto: string) => {
    if (!vacante) return;
    const nuevos = [...vacante.requerimientos];
    nuevos[index] = texto;
    setVacante({ ...vacante, requerimientos: nuevos });
  };

  const handleEditarVacante = async () => {
    if (!vacante) {
      setErrorMessage('La vacante no fue cargada correctamente');
      setShowError(true);
      return;
    }

    try {
      const payload = {
        job_type: vacante.rolNombre === 'Otro' ? null : vacante.rolNombre,
        specific_job_type: vacante.rolNombre === 'Otro' ? vacante.otrosRol : null,
        description: vacante.descripcion,
        requirements: vacante.requerimientos.map((r: string) => ({ description: r })),
        shifts: vacante.turnos.map((t) => ({
          start_date: t.fechaInicio.toISOString().slice(0, 10),
          end_date: t.fechaFin.toISOString().slice(0, 10),
          start_time: t.horaInicio,
          end_time: t.horaFin,
          payment: parseInt(t.pago.replace(/\./g, ''), 10),
          quantity: parseInt(t.cantidad, 10),
        })),
        event: idVacancy,
      };
      //await requestBackend(`/api/vancancies/${id}/update`, payload, 'PUT');
      setShowSuccess(true);
    } catch (error: any) {
      setErrorMessage('Error al editar la vacante');
      setShowError(true);
    }
  };

  return {
    vacante,
    loading,
    showSuccess,
    showError,
    errorMessage,
    closeError: () => setShowError(false),
    closeSuccess: () => {
      setShowSuccess(false);
      router.push('/manipular');
    },
    rolesDisponibles,
    actualizarCampo,
    actualizarTurno,
    actualizarRequerimiento,
    handleEditarVacante,
  };
};
