import { useEffect, useMemo, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';

type Turno = {
  fechaInicio: Date | null;
  horaInicio: string;
  fechaFin: Date | null;
  horaFin: string;
  pago: string;      // mantener como string para inputs controlados
  cantidad: string;  // idem
};

type Vacante = {
  rol: string;       // siempre el ID como string
  rolNombre: string; // nombre legible
  otrosRol: string;
  descripcion: string;
  requerimientos: string[];
  turnos: Turno[];
};

type Rol = { id: number; name: string };

// ======================== utils ========================
const formatearFecha = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Acepta Date, timestamp, "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss...", "DD/MM/YYYY"
const parseBackendDate = (v: unknown): Date | null => {
  if (!v) return null;

  if (v instanceof Date) {
    return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  }

  if (typeof v === 'number') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  if (typeof v === 'string') {
    const s = v.trim();

    // YYYY-MM-DD o YYYY-MM-DDTHH:mm:ssZ
    const mISO = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (mISO) {
      const y = +mISO[1], m = +mISO[2], d = +mISO[3];
      return new Date(y, m - 1, d);
    }

    // DD/MM/YYYY
    const mDMY = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
    if (mDMY) {
      const d = +mDMY[1], m = +mDMY[2], y = +mDMY[3];
      return new Date(y, m - 1, d);
    }

    // Último intento
    const d2 = new Date(s);
    return isNaN(d2.getTime()) ? null : new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  }

  return null;
};

const normalizarPago = (raw: string): string => {
  const s = (raw ?? '').toString().trim();
  if (!s) return '0.00';

  // Caso 1: "14.000,50" (es-AR)
  if (/,\d{1,2}$/.test(s)) {
    const sinMiles = s.replace(/\./g, '');
    const conPunto = sinMiles.replace(',', '.');
    const n = Number(conPunto);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
  }

  // Caso 2: "14,000.50" o "14000.50" (en-US / mixed)
  if (/\.\d{1,2}$/.test(s)) {
    const sinMiles = s.replace(/,/g, '');
    const n = Number(sinMiles);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
  }

  // Caso 3: enteros, con o sin separadores
  const soloDigitos = s.replace(/[^\d]/g, '');
  if (!soloDigitos) return '0.00';
  const n = Number(soloDigitos);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

const emptyTurno: Turno = { fechaInicio: null, horaInicio: '', fechaFin: null, horaFin: '', pago: '', cantidad: '' };

const emptyVacancy: Vacante = {
  rol: '',
  rolNombre: '',
  otrosRol: '',
  descripcion: '',
  requerimientos: [],
  turnos: [emptyTurno],
};

export const useEditVacancy = (idVacancy: string | number) => {
  const { requestBackend } = useBackendConection();
  const { validateToken } = useTokenValidations();

  const [vacante, setVacante] = useState<Vacante>(emptyVacancy);
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);

  const opcionesDropdown = useMemo(
    () => rolesDisponibles.map(r => ({ id: r.id.toString(), name: r.name })),
    [rolesDisponibles]
  );

  const [expandedVacancy, setExpandedVacancy] = useState<boolean>(true);
  const [expandedShift, setExpandedShift] = useState<number | null>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | undefined>(undefined);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | undefined>(undefined);

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const v = await validateToken('employer');
      if (!v.ok) {
        setErrorMessage('Tu sesión no es válida o no sos employer.');
        setShowError(true);
        // router.replace('/login'); // si querés redirigir
        return;
      }
        const data = await requestBackend(`/api/vacancies/${idVacancy}/details`, null, 'GET');
        const roles: Rol[] = await requestBackend('/api/vacancies/job-types', null, 'GET');
        setRolesDisponibles(roles);

        // Fechas del evento (como fallback y límites)
        const eventStart = parseBackendDate((data as any)?.event?.start_date);
        const eventEnd   = parseBackendDate((data as any)?.event?.end_date);

        // Shifts → estado interno Date | null
        let turnos: Turno[] = ((data as any)?.shifts || []).map((t: any) => {
          const fi = parseBackendDate(t?.start_date);
          const ff = parseBackendDate(t?.end_date);
          return {
            fechaInicio: fi,
            horaInicio: (t?.start_time || '').slice(0, 5),
            fechaFin: ff,
            horaFin: (t?.end_time || '').slice(0, 5),
            pago: t?.payment != null ? String(t.payment) : '',
            cantidad: t?.quantity != null ? String(t.quantity) : '',
          };
        });

        // (Opcional) Fallback: completar fechas vacías con las del evento
        turnos = turnos.map(t => ({
          ...t,
          fechaInicio: t.fechaInicio ?? eventStart ?? null,
          fechaFin:    t.fechaFin    ?? eventEnd   ?? null,
        }));

        // Límites para los DatePicker
        const inicios = turnos.map(t => t.fechaInicio).filter(Boolean) as Date[];
        const fines   = turnos.map(t => t.fechaFin).filter(Boolean) as Date[];

        const minDate = inicios.length ? new Date(Math.min(...inicios.map(d => d.getTime()))) : (eventStart ?? undefined);
        const maxDate = fines.length   ? new Date(Math.max(...fines.map(d => d.getTime())))   : (eventEnd   ?? undefined);

        setFechaInicioEvento(minDate);
        setFechaFinEvento(maxDate);

        const rolId = roles.find(r => r.name === (data as any)?.job_type)?.id?.toString() ?? '';

        setVacante({
          rol: rolId,
          rolNombre: (data as any)?.job_type ?? '',
          otrosRol: (data as any)?.specific_job_type || '',
          descripcion: (data as any)?.description ?? '',
          requerimientos: ((data as any)?.requirements || [])
            .map((r: any) => r?.description ?? '')
            .filter(Boolean),
          turnos: turnos.length ? turnos : [emptyTurno],
        });
      } catch (e) {
        setErrorMessage('Error al cargar los datos');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idVacancy]);

  const actualizarCampo = <K extends keyof Vacante>(campo: K, valor: Vacante[K]) =>
    setVacante(prev => ({ ...prev, [campo]: valor }));

  const actualizarRol = (id: string, nombre: string) =>
    setVacante(prev => ({
      ...prev,
      rol: id,
      rolNombre: nombre || '',
      otrosRol: nombre === 'Otro' ? prev.otrosRol : '',
    }));

  const agregarRequerimiento = () =>
    setVacante(prev => ({ ...prev, requerimientos: [...prev.requerimientos, ''] }));

  const actualizarRequerimiento = (rIndex: number, texto: string) =>
    setVacante(prev => {
      const reqs = [...prev.requerimientos];
      reqs[rIndex] = texto;
      return { ...prev, requerimientos: reqs };
    });

  const eliminarRequerimiento = (rIndex: number) =>
    setVacante(prev => ({ ...prev, requerimientos: prev.requerimientos.filter((_, i) => i !== rIndex) }));

  const agregarTurno = () =>
    setVacante(prev => ({ ...prev, turnos: [...prev.turnos, { ...emptyTurno }] }));

  const eliminarTurno = (tIndex: number) =>
    setVacante(prev => ({ ...prev, turnos: prev.turnos.filter((_, i) => i !== tIndex) }));

  // Type-safe e inmutable
  const actualizarTurno = <K extends keyof Turno>(tIndex: number, campo: K, valor: Turno[K]) =>
    setVacante(prev => {
      const turnos = [...prev.turnos];
      const turnoPrev = turnos[tIndex];

      let nuevoValor = valor;
      if (campo === 'fechaInicio' || campo === 'fechaFin') {
        if (valor === null) {
          nuevoValor = null as Turno[K];
        } else if (valor instanceof Date) {
          const d = new Date(valor.getFullYear(), valor.getMonth(), valor.getDate()); // 00:00
          nuevoValor = d as Turno[K];
        }
      }

      turnos[tIndex] = { ...turnoPrev, [campo]: nuevoValor };
      return { ...prev, turnos };
    });

  const toggleVacancy = () => setExpandedVacancy(v => !v);
  const toggleShift  = (tIndex: number) => setExpandedShift(prev => (prev === tIndex ? null : tIndex));

  const closeError   = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  const buildPayload = (v: Vacante) => {
    const selectedRole = rolesDisponibles.find(r => r.id.toString() === v.rol);
    const isOtro = selectedRole?.name === 'Otro';

    return {
      description: v.descripcion,
      job_type_id: selectedRole ? selectedRole.id : null,  // siempre ID (incluye “Otro”)
      specific_job_type: isOtro ? (v.otrosRol || null) : null,
      requirements: v.requerimientos.filter(Boolean),
      shifts: v.turnos.map(t => ({
        start_date: t.fechaInicio ? formatearFecha(t.fechaInicio) : null,
        end_date:   t.fechaFin ? formatearFecha(t.fechaFin) : null,
        start_time: t.horaInicio || null,
        end_time:   t.horaFin || null,
        payment:    normalizarPago(t.pago),
        quantity:   t.cantidad ? Number(t.cantidad) : null,
      })),
    };
  };

  const handleGuardarCambios = async () => {
    try {
      setLoading(true);
      if (!vacante.descripcion?.trim()) {
        setErrorMessage('La descripción no puede estar vacía.');
        setShowError(true);
        return;
      }
      const payload = buildPayload(vacante);
      // await requestBackend(`/api/vacancies/${idVacancy}`, payload, 'PUT');
      console.log(payload);
      setShowSuccess(true);
    } catch {
      setErrorMessage('No se pudo guardar la vacante.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    // datos
    vacante,
    opcionesDropdown,
    rolesDisponibles,

    // límites fecha
    fechaInicioEvento,
    fechaFinEvento,

    // flags
    loading,
    showError,
    errorMessage,
    showSuccess,

    // mutadores
    actualizarCampo,
    actualizarRequerimiento,
    agregarRequerimiento,
    eliminarRequerimiento,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
    actualizarRol,

    // expanders
    expandedVacancy,
    expandedShift,
    toggleVacancy,
    toggleShift,

    // acciones
    handleGuardarCambios,
    closeError,
    closeSuccess,
  };
};
