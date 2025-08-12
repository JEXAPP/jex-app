// /hooks/services/useCreateVacancy.ts
import useBackendConection from '@/services/internal/useBackendConection';
import { useDataTransformation } from '@/services/internal/useDataTransformation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Tipos
type Turno = {
  fechaInicio: Date | null;
  horaInicio: string;
  fechaFin: Date | null;
  horaFin: string;
  pago: string;
  cantidad: string;
};

type Vacante = {
  rol: string;
  otrosRol: string;
  rolNombre: string;
  descripcion: string;
  requerimientos: string[];
  turnos: Turno[];
};

type RolDTO = { name: string; id: number };

const crearTurno = (): Turno => ({
  fechaInicio: null,
  horaInicio: '',
  fechaFin: null,
  horaFin: '',
  pago: '',
  cantidad: '',
});

const crearVacante = (): Vacante => ({
  rol: '',
  otrosRol: '',
  rolNombre: '',
  descripcion: '',
  requerimientos: [''],
  turnos: [crearTurno()],
});

const soloNumeros = (v: string) => v.replace(/\D/g, '');
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const formatearFecha = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const limpiarYFormatearPago = (pago: string): string => {
  const soloNumeros = pago.replace(/\./g, ''); // elimina puntos de miles
  const numero = parseInt(soloNumeros, 10);
  if (isNaN(numero)) return '0.00';
  return `${numero.toFixed(2)}`; // agrega ".00"
};

// === NUEVO: helpers para filtrar/validar turnos ===
const turnoVacio = (t: Turno) =>
  !t.fechaInicio && !t.horaInicio && !t.fechaFin && !t.horaFin && !t.pago && !t.cantidad;

const turnoCompleto = (t: Turno) =>
  !!t.fechaInicio && !!t.horaInicio && !!t.fechaFin && !!t.horaFin && !!t.pago && !!t.cantidad;

export const useCreateVacancy = () => {
  const { stringToDate } = useDataTransformation();
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const { id, fechaInicio, fechaFin } = useLocalSearchParams();

  const fechaStr = Array.isArray(fechaInicio) ? fechaInicio[0] : fechaInicio;
  const fechaInicioEvento = stringToDate(fechaStr);

  const fechaStr2 = Array.isArray(fechaFin) ? fechaFin[0] : fechaFin;
  const fechaFinEvento = stringToDate(fechaStr2);

  const [vacantes, setVacantes] = useState<Vacante[]>([crearVacante()]);
  const [rolesDisponibles, setRolesDisponibles] = useState<RolDTO[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Carga de roles
  useEffect(() => {
    (async () => {
      try {
        const data = await requestBackend('/api/vacancies/job-types/', null, 'GET');
        setRolesDisponibles((data ?? []) as RolDTO[]);
      } catch {
        setRolesDisponibles([]);
      }
    })();
  }, []);

  // Opciones para dropdown
  const opcionesDropdown = useMemo(
    () => rolesDisponibles.map(r => ({ name: r.name, id: String(r.id) })),
    [rolesDisponibles]
  );

  // Mutadores de lista de vacantes
  const setVac = useCallback(
    (fn: (prev: Vacante[]) => Vacante[]) => setVacantes(prev => fn([...prev])),
    []
  );

  const agregarVacante = () => {
    setVacantes(prev => {
      const next = [...prev, crearVacante()];
      const newIndex = next.length - 1;
      setExpandedVacancy(newIndex);
      setExpandedShiftByVacancy(p => ({ ...p, [newIndex]: null }));
      return next;
    });
  };

  const eliminarVacante = (index: number) => {
    setVacantes(prev => {
      const next = prev.filter((_, i) => i !== index);
      setExpandedVacancy(v => (v == null ? null : v === index ? null : v > index ? v - 1 : v));
      setExpandedShiftByVacancy(p => {
        const copy = { ...p };
        const updated: Record<number, number | null> = {};
        next.forEach((_, i) => {
          const oldI = i >= index ? i + 1 : i;
          updated[i] = copy[oldI] ?? null;
        });
        return updated;
      });
      return next;
    });
  };

  const actualizarRol = (index: number, idRol: string, nombre: string) =>
    setVac(prev => {
      prev[index] = { ...prev[index], rol: idRol, rolNombre: nombre };
      return prev;
    });

  const actualizarCampo = (
    index: number,
    campo: 'rol' | 'otrosRol' | 'rolNombre' | 'descripcion',
    valor: string
  ) =>
    setVac(prev => {
      prev[index] = { ...prev[index], [campo]: valor } as Vacante;
      return prev;
    });

  const actualizarRequerimiento = (iVac: number, iReq: number, texto: string) =>
    setVac(prev => {
      const v = { ...prev[iVac] };
      const reqs = [...v.requerimientos];
      reqs[iReq] = texto;
      prev[iVac] = { ...v, requerimientos: reqs };
      return prev;
    });

  const agregarRequerimiento = (iVac: number) =>
    setVac(prev => {
      const v = prev[iVac];
      prev[iVac] = { ...v, requerimientos: [...v.requerimientos, ''] };
      return prev;
    });

  const eliminarRequerimiento = (iVac: number, iReq: number) =>
    setVac(prev => {
      const v = prev[iVac];
      const reqs = v.requerimientos.filter((_, i) => i !== iReq);
      prev[iVac] = { ...v, requerimientos: reqs };
      return prev;
    });

  const agregarTurno = (vIndex: number) => {
    setVacantes(prev => {
      const next = [...prev];
      next[vIndex] = { ...next[vIndex], turnos: [...next[vIndex].turnos, crearTurno()] };
      const newTIndex = next[vIndex].turnos.length - 1;
      setExpandedShiftByVacancy(p => ({ ...p, [vIndex]: newTIndex }));
      return next;
    });
  };

  const eliminarTurno = (vIndex: number, tIndex: number) => {
    setVacantes(prev => {
      const next = [...prev];
      const turnos = next[vIndex].turnos.filter((_, i) => i !== tIndex);
      next[vIndex] = { ...next[vIndex], turnos };

      setExpandedShiftByVacancy(p => {
        const cur = p[vIndex] ?? null;
        if (cur == null) return p;
        if (cur === tIndex) return { ...p, [vIndex]: null };
        if (cur > tIndex) return { ...p, [vIndex]: cur - 1 };
        return p;
      });

      return next;
    });
  };

  const actualizarTurno = (
    iVac: number,
    iTur: number,
    campo: keyof Turno,
    valor: string | Date | null
  ) =>
    setVac(prev => {
      const v = prev[iVac];
      const turnos = [...v.turnos];
      const t = { ...turnos[iTur] };

      // Asignación con normalizaciones
      if (campo === 'cantidad' && typeof valor === 'string') {
        const n = soloNumeros(valor);
        t.cantidad = n ? String(clamp(parseInt(n, 10), 1, 50)) : '';
      } else if (campo === 'pago' && typeof valor === 'string') {
        // normaliza NBSP u otros espacios
        const limpio = valor.replace(/\u00A0/g, ' ');
        const n = soloNumeros(limpio);
        t.pago = n ? parseInt(n, 10).toLocaleString('es-AR') : '';
      } else {
        (t[campo] as typeof valor) = valor;
      }

      // Validaciones (no borramos valores)
      if (t.fechaInicio && t.fechaFin) {
        if (t.fechaFin.getTime() < t.fechaInicio.getTime()) {
          setErrorMessage('La fecha de fin debe ser mayor o igual a la fecha de inicio.');
          setShowError(true);
        }
      }

      if (t.horaInicio && t.horaFin) {
        const [h1, m1] = t.horaInicio.split(':').map(Number);
        const [h2, m2] = t.horaFin.split(':').map(Number);
        if (h2 * 60 + m2 <= h1 * 60 + m1) {
          setErrorMessage('El horario de fin debe ser mayor al horario de inicio.');
          setShowError(true);
        }
      }

      turnos[iTur] = t;
      prev[iVac] = { ...v, turnos };
      return prev;
    });

  const handleRegistrarTodas = async () => {
    // Quitamos turnos vacíos y vacantes sin contenido mínimo
    const vacantesLimpias = vacantes
      .map(v => {
        const turnosUtiles = v.turnos.filter(t => !turnoVacio(t));
        return { ...v, turnos: turnosUtiles };
      })
      .filter(v => {
        const baseOk =
          !!v.rol && (v.rolNombre !== 'Otro' || !!v.otrosRol.trim()) && !!v.descripcion.trim();
        const tieneAlMenosUnTurno = v.turnos.some(turnoCompleto);
        return baseOk && tieneAlMenosUnTurno;
      });

    const esValido =
      vacantesLimpias.length > 0 && vacantesLimpias.every(v => v.turnos.every(turnoCompleto));

    if (!esValido) {
      setErrorMessage('Error al registrar las vacantes. \nPor favor completa todos los datos.');
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      
      const payload = vacantesLimpias.map(v => {
        const base = {
          event: Number(id),
          job_type: Number(v.rol),
          description: v.descripcion,
          requirements: v.requerimientos.filter(r => r.trim()).map(r => ({ description: r })),
          shifts: v.turnos.filter(turnoCompleto).map(t => ({
            start_date: formatearFecha(t.fechaInicio!),
            start_time: t.horaInicio,
            end_date: formatearFecha(t.fechaFin!),
            end_time: t.horaFin,
            payment: limpiarYFormatearPago(t.pago),
            quantity: Number(t.cantidad),
          })),
        };

        return v.rolNombre === 'Otro' ? { ...base, specific_job_type: v.otrosRol } : base;
      });
      await requestBackend('/api/vacancies/create/', payload, 'POST');
      setShowSuccess(true);
    } catch (error: any) {
      console.log(error)
      const mensaje =
        error?.response?.data?.message ||
        'Error al registrar las vacantes';
      setErrorMessage(mensaje);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/employer');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Estado para expandir/minimizar
  const [expandedVacancy, setExpandedVacancy] = useState<number | null>(0);
  // Por vacante, qué turno está expandido (null = todos minimizados)
  const [expandedShiftByVacancy, setExpandedShiftByVacancy] = useState<Record<number, number | null>>({ 0: 0 });

  // Alternar vacante
  const toggleVacancy = (index: number) => {
    setExpandedVacancy(prev => (prev === index ? null : index));
  };

  // Alternar turno dentro de una vacante
  const toggleShift = (vIndex: number, tIndex: number) => {
    setExpandedShiftByVacancy(prev => ({
      ...prev,
      [vIndex]: prev[vIndex] === tIndex ? null : tIndex,
    }));
  };

  return {
    vacantes,
    agregarVacante,
    actualizarCampo,
    actualizarRequerimiento,
    agregarRequerimiento,
    eliminarRequerimiento,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
    handleRegistrarTodas,
    showSuccess,
    showError,
    errorMessage,
    closeError,
    opcionesDropdown,
    actualizarRol,
    closeSuccess,
    eliminarVacante,
    expandedVacancy,
    expandedShiftByVacancy,
    toggleVacancy,
    toggleShift,
    loading,
    fechaInicioEvento,
    fechaFinEvento,
  };
};
