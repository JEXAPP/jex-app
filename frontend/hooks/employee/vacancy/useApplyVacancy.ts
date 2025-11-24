// src/hooks/employee/vacancy/useApplyVacancy.ts
import { Job, Organizer, Requirement } from '@/constants/interfaces';
import useBackendConection from '@/services/internal/useBackendConection';
import { useDataTransformation } from '@/services/internal/useDataTransformation';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

type ShiftTurn = {
  id: number;
  horario: string;
  paga: string;
  already_applied: boolean;
};

type ShiftGroup = {
  id: string; // fecha legible
  dia: string;
  turnos: ShiftTurn[];
};

type Coords = { latitude: number; longitude: number };

export const useApplyVacancy = () => {
  const { id } = useLocalSearchParams();
  const idVancancy = Number(id);
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { formatFechaLarga, formatFechaCorta } = useDataTransformation();
  const { validateToken } = useTokenValidations();
  const [job, setJob] = useState<Job | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [turnos, setTurnos] = useState<ShiftGroup[]>([]);
  const [turnosSeleccionados, setTurnosSeleccionados] = useState<number[]>([]);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<Coords | null>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // 👉 NUEVO: id del empleador (organizador del evento)
  const [employerId, setEmployerId] = useState<number | null>(null);

  useEffect(() => {
    validateToken('employee');
    fetchJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Autoseleccionar si hay un único turno y NO está ya aplicado
    if (turnos.length === 1 && turnos[0].turnos.length === 1) {
      const unico = turnos[0].turnos[0];
      if (!unico.already_applied) {
        setTurnosSeleccionados([unico.id]);
      } else {
        setTurnosSeleccionados([]);
      }
    }
  }, [turnos]);

  const handleToggleTurnos = (id: number) => {
    // Evitar selección si ese turno ya fue aplicado
    const turno = turnos.flatMap(b => b.turnos).find(t => t.id === id);
    if (turno?.already_applied) return;

    const haySoloUnTurno = turnos.length === 1 && turnos[0].turnos.length === 1;
    if (haySoloUnTurno) return;

    setTurnosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const salarioAMostrar = useMemo(() => {
    if (turnosSeleccionados.length === 0) return 'Elegí un turno';

    const salarios = turnos
      .flatMap(t => t.turnos)
      .filter(t => turnosSeleccionados.includes(t.id))
      .map(t => Number(String(t.paga).replace(/\D/g, '')))
      .filter(n => !Number.isNaN(n));

    if (salarios.length === 0) return 'Elegí un turno';
    const mayorSalario = Math.max(...salarios);
    return `${mayorSalario.toLocaleString('es-AR')} ARS`;
  }, [turnos, turnosSeleccionados]);

  const allShiftsApplied = useMemo(() => {
    if (turnos.length === 0) return false;
    return turnos.every(b => b.turnos.every(t => t.already_applied));
  }, [turnos]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const vacante = await requestBackend(`/api/vacancies/${idVancancy}/details`, null, 'GET');

      const owner = vacante.event.owner;

      // 👉 guardamos el id del empleador para el modal de calificaciones
      setEmployerId(owner.id ?? owner.owner_id ?? null);

      setJob({
        title: vacante.event.name,
        description: vacante.description,
        role: vacante.job_type,
        date: formatFechaLarga(vacante.shifts[0]?.start_date),
        time: `${vacante.shifts[0]?.start_time} a ${vacante.shifts[0]?.end_time}`,
        requirements: (vacante.requirements as Requirement[]).map(r => `${r.description}`),
        salary: `${vacante.shifts[0]?.payment ?? ''} ARS`,
        deadline: formatFechaCorta(vacante.shifts[0]?.start_date),
        event_image_url: vacante.event.event_image_url,
        event_image_public_id: vacante.event.event_image_public_id,
        mapImage: require('@/assets/images/maps.webp'),
        rating: owner.average_rating ?? 0,
      });

      // ✅ Manejo correcto de imagen del organizador
      const organizerImage =
        owner.profile_image && typeof owner.profile_image === "object" && owner.profile_image.url
          ? owner.profile_image.url
          : require('@/assets/images/jex/Jex-FotoPerfil.webp');

      setOrganizer({
        name: owner.company_name || owner.email || '-',
        reviews: owner.rating_count ?? 0,
        rating: owner.average_rating ?? 0,
        jexTime: '1 año',
        image: organizerImage,
      });

      // ===== Ubicación segura (evita [object Object]) =====
      const ev = vacante.event || {};
      const partsRaw = [
        ev.formatted_address,
        ev.address_full,
        ev.address,
        ev.street || ev.street_name,
        ev.number || ev.street_number,
        ev.locality || ev.city,
        ev.province || ev.state,
      ];

      // solo strings no vacías
      const parts = partsRaw
        .filter((p: any) => typeof p === 'string' && p.trim().length > 0)
        .map((p: string) => p.trim());

      const composed = parts.length ? parts.join(', ') : null;
      setLocationAddress(composed);

      const lat =
        typeof ev.latitude === 'number' ? ev.latitude :
        typeof ev.lat === 'number' ? ev.lat :
        typeof ev?.location?.latitude === 'number' ? ev.location.latitude :
        typeof ev?.coordinates?.lat === 'number' ? ev.coordinates.lat :
        typeof ev?.coords?.lat === 'number' ? ev.coords.lat :
        null;

      const lng =
        typeof ev.longitude === 'number' ? ev.longitude :
        typeof ev.lng === 'number' ? ev.lng :
        typeof ev?.location?.longitude === 'number' ? ev.location.longitude :
        typeof ev?.coordinates?.lng === 'number' ? ev.coordinates.lng :
        typeof ev?.coords?.lng === 'number' ? ev.coords.lng :
        null;

      setLocationCoords(
        typeof lat === 'number' && typeof lng === 'number'
          ? { latitude: lat, longitude: lng }
          : null
      );

      // ===== Shifts agrupados + already_applied
      const grupos = new Map<string, ShiftGroup>();
      for (const shift of vacante.shifts) {
        const dia = formatFechaLarga(shift.start_date);
        const pagoBase = typeof shift.payment === 'string' ? shift.payment.slice(0, -3) : String(shift.payment);

        if (!grupos.has(dia)) grupos.set(dia, { id: dia, dia, turnos: [] });

        grupos.get(dia)!.turnos.push({
          id: shift.id,
          horario: `${String(shift.start_time).substring(0, 5)} a ${String(shift.end_time).substring(0, 5)}`,
          paga: `${pagoBase} ARS`,
          already_applied: !!shift.already_applied,
        });
      }

      const turnosOrdenados = Array.from(grupos.values())
        .map(b => ({ ...b, turnos: b.turnos.sort((a, c) => a.horario.localeCompare(c.horario, 'es')) }))
        .sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());

      setTurnos(turnosOrdenados);

    } catch (err: any) {
      console.log('Hubo un error al cargar los datos:', err);
      setErrorMessage('Error al cargar los datos del trabajo');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      const payload = {
        vacancy_id: idVancancy,
        shifts: turnosSeleccionados,
      };
      await requestBackend('/api/applications/apply/', payload, 'POST');
      setShowSuccess(true);

      setTimeout(() => {
        router.replace('/employee');
        setShowSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.log('Error al postularse:', err);
      setErrorMessage(err?.error ?? 'No se pudo completar la postulación');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccess = () => {
    router.replace('/employee');
  };

  const goBack = () => router.back();

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
    salarioAMostrar,
    turnoSeleccionadoValido: turnosSeleccionados.length > 0,
    closeSuccess,
    allShiftsApplied,
    locationAddress,
    locationCoords,
    goBack,
    employerId,      // 👉 NUEVO
  };
};
