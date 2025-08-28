import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

type Option = { id: number | string; name: string };

const stringToDate = (s?: string | null): Date | null => {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  const maybe = new Date(s);
  return isNaN(maybe.getTime()) ? null : maybe;
};

const dateToString = (d: Date | null): string | null => {
  if (!d) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const useEditEvent = () => {
  const router = useRouter();
  const eventId = useLocalSearchParams<{ id?: string }>(); 
  const { requestBackend } = useBackendConection();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState(''); // HH:mm
  const [horaFin, setHoraFin] = useState('');       // HH:mm

  const [rubros, setRubros] = useState<Option[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Option | null>(null);
  const setRubro = (opt: Option) => setSelectedRubro(opt);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  const originalLocationRef = useRef<{ location: string; lat?: number | null; long?: number | null }>({
    location: '',
    lat: null,
    long: null,
  });
  const [locationDirty, setLocationDirty] = useState(false);

  const guardarHabilitado = //si es true esta habilitado, si alguna da false está deshabilitado
    nombreEvento.length > 0 &&
    descripcionEvento.length > 0 &&
    ubicacionEvento.length > 0 &&
    !!selectedRubro?.id &&
    !!fechaInicioEvento &&
    !!fechaFinEvento &&
    !!horaInicio &&
    !!horaFin;

  //cargar rubros
  const loadRubros = async () => {
    try {
      const response = await requestBackend('/api/events/categories/', null, 'GET');
      const items = Array.isArray(response) ? response : response?.results ?? [];
      const mapped: Option[] = items.map((it: any) => ({ id: it.id, name: it.name }));
      setRubros(mapped);
    } catch {
      setErrorMessage('No se pudieron cargar los rubros.');
      setShowError(true);
    }
  };

  //cargar evento
  const loadEventDetail = async () => {
    if (!eventId || Number.isNaN(eventId)) {
      setErrorMessage('ID de evento inválido.');
      setShowError(true);
      setShowSkeleton(false);
      return;
    }
    try {
      const data = await requestBackend(`/api/events/detail/${eventId}/`, null, 'GET');
      setNombreEvento(data?.name ?? '');
      setDescripcionEvento(data?.description ?? '');
      setUbicacionEvento(data?.location ?? '');
      setFechaInicioEvento(stringToDate(data?.start_date));
      setFechaFinEvento(stringToDate(data?.end_date));
      setHoraInicio((data?.start_time ?? '').slice(0, 5)); // el slice es para mostrar la hora asi HH:mm
      setHoraFin((data?.end_time ?? '').slice(0, 5));      // el slice es para mostrar la hora asi HH:mm

      const cat = data?.category; // { id, name }
      setSelectedRubro(cat ? { id: cat.id, name: cat.name } : null);

      originalLocationRef.current = {
        location: data?.location ?? '',
        lat: typeof data?.latitud === 'number' ? data.latitud : data?.latitud ?? null,
        long: typeof data?.longitud === 'number' ? data.longitud : data?.longitud ?? null,
      };
      setLocationDirty(false); //location dirty es true si se cambio la ubicación, si no sigue false
    } catch {
      setErrorMessage('No se pudo cargar la información del evento.');
      setShowError(true);
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    setShowSkeleton(true);
    Promise.all([loadRubros(), loadEventDetail()]).finally(() => {});
  }, [eventId]);

  //Ubicación
  const handleUbicacion = (txt: string) => {
    setUbicacionEvento(txt);
    const was = originalLocationRef.current.location || '';
    setLocationDirty(txt !== was);
  };

  //Guardar
  const handleEditarEvento = async () => {
    if (!guardarHabilitado) return;
    setLoading(true);
    try {
      const payload: any = {
        name:nombreEvento,
        description:descripcionEvento,
        location:ubicacionEvento,
        category: selectedRubro ? Number(selectedRubro.id) : null,
        start_date: dateToString(fechaInicioEvento),
        start_time: horaInicio.length === 5 ? `${horaInicio}:00` : horaInicio, // HH:mm:ss
        end_date: dateToString(fechaFinEvento),
        end_time: horaFin.length === 5 ? `${horaFin}:00` : horaFin,
        latitud: locationDirty ? null : (originalLocationRef.current.lat ?? null),
        longitud: locationDirty ? null : (originalLocationRef.current.long ?? null),
      };
      await requestBackend(`/api/events/update/${eventId}/`, payload, 'PUT');
      //console.log(payload)
      setShowSuccess(true);
    } catch {
      setErrorMessage('No se pudo guardar los cambios del evento.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  //Eliminar (baja logica estado=6)
  const handleEliminarEvento = () => setMostrarConfirmEliminar(true);

  const confirmarEliminar = async () => {
    try {
      await requestBackend(`/api/events/update/${eventId}/state/`, 6, 'PATCH');
      //console.log("se eliminó")
      setMostrarConfirmEliminar(false);
      setShowSuccess(true);
      setTimeout(() => router.back(), 600);
    } catch {
      setMostrarConfirmEliminar(false);
      setErrorMessage('No se pudo eliminar el evento.');
      setShowError(true);
    }
  };

  const cancelarEliminar = () => setMostrarConfirmEliminar(false);

  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  return {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    horaInicio,
    horaFin,
    rubros,
    selectedRubro,
    setSelectedRubro,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    setHoraInicio,
    setHoraFin,
    handleUbicacion,
    handleEditarEvento,
    handleEliminarEvento,
    confirmarEliminar,
    cancelarEliminar,
    loading,
    guardarHabilitado,
    showSkeleton,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
    mostrarConfirmEliminar,
  };
};

