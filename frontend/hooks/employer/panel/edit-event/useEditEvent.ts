import useGooglePlaces from '@/services/external/useGooglePlaces';
import { useUploadImageServ } from '@/services/external/useUploadImage';
import useBackendConection, { getApiErrorMessage } from '@/services/internal/useBackendConection';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Option = { id: number | string; name: string };

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

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

const dateToBackendDDMMYYYY = (d: Date | null): string | null => {
  if (!d) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Normaliza a HH:mm (24h). Acepta "9:5", "09:05", "09:05:00", etc.
const toHHMM = (s: string): string => {
  const m = s?.match?.(/^(\d{1,2}):(\d{1,2})(?::\d{1,2})?$/);
  if (!m) throw new Error('Hora inválida. Usa HH:mm');
  const hh = Number(m[1]); const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) throw new Error('Hora fuera de rango (00:00–23:59)');
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const useEditEvent = () => {
  const { uploadImage } = useUploadImageServ();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const eventIdStr = Array.isArray(id) ? id[0] : id;
  const eventIdNum = Number(eventIdStr);

  const { requestBackend } = useBackendConection();
  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);

  const { sugerencias, setSugerencias, buscarSugerencias, obtenerCoordenadas } = useGooglePlaces();

  const [nombreEvento, setNombreEvento] = useState('');
  const [ubicacionId, setUbicacionId] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageID, setImageID] = useState<string | null>(null);
  const [horaInicio, setHoraInicio] = useState(''); // HH:mm
  const [horaFin, setHoraFin] = useState('');       // HH:mm

  const [rubros, setRubros] = useState<Option[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Option | null>(null);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  const originalLocationRef = useRef<{ location: string; lat: number | null; long: number | null }>({
    location: '',
    lat: null,
    long: null,
  });
  const [locationDirty, setLocationDirty] = useState(false);

  const guardarHabilitado =
    nombreEvento.length > 0 &&
    descripcionEvento.length > 0 &&
    ubicacionEvento.length > 0 &&
    !!selectedRubro?.id &&
    !!fechaInicioEvento &&
    !!fechaFinEvento &&
    !!horaInicio &&
    !!horaFin;

  // cargar rubros
  const loadRubros = async () => {
    try {
      const response = await requestBackend('/api/events/categories/', null, 'GET');
      const items = Array.isArray(response) ? response : response?.results ?? [];
      const mapped: Option[] = items.map((it: any) => ({ id: it.id, name: it.name }));
      setRubros(mapped);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
      setShowError(true);
    }
  };

  // cargar evento
  const loadEventDetail = async () => {
    if (!eventIdStr || Number.isNaN(eventIdNum)) {
      setErrorMessage('ID de evento inválido.');
      setShowError(true);
      setShowSkeleton(false);
      return;
    }
    try {
      const data = await requestBackend(`/api/events/detail/${eventIdNum}/`, null, 'GET');

      setNombreEvento(data?.name ?? '');
      setDescripcionEvento(data?.description ?? '');
      setUbicacionEvento(data?.location ?? '');
      setFechaInicioEvento(stringToDate(data?.start_date));
      setFechaFinEvento(stringToDate(data?.end_date));
      setHoraInicio((data?.start_time ?? '').slice(0, 5)); // HH:mm
      setHoraFin((data?.end_time ?? '').slice(0, 5));      // HH:mm
      setImageID(data?.event_image_public_id ?? null);
      setImageURL(data?.event_image_url ?? null);

      const cat = data?.category; // { id, name }
      setSelectedRubro(cat ? { id: cat.id, name: cat.name } : null);

      // Normalizar lat/long a número o null
      const rawLat = data?.latitud ?? data?.latitude;
      const rawLng = data?.longitud ?? data?.longitude;
      const latNum =
        typeof rawLat === 'number' ? rawLat :
        typeof rawLat === 'string' ? parseFloat(rawLat) : null;
      const lngNum =
        typeof rawLng === 'number' ? rawLng :
        typeof rawLng === 'string' ? parseFloat(rawLng) : null;

      originalLocationRef.current = {
        location: data?.location ?? '',
        lat: Number.isFinite(latNum as number) ? (latNum as number) : null,
        long: Number.isFinite(lngNum as number) ? (lngNum as number) : null,
      };

      setLocationDirty(false);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
      setShowError(true);
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    setShowSkeleton(true);
    Promise.all([loadRubros(), loadEventDetail()]).finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIdNum]);

  // Ubicación
  const handleUbicacion = (txt: string) => {
    setUbicacionEvento(txt);
    const was = originalLocationRef.current.location || '';
    setLocationDirty(txt !== was);
    buscarSugerencias(txt);
  };

  // Guardar
  const handleEditarEvento = async () => {
    if (!guardarHabilitado) return;
    setLoading(true);
    try {
      // Si cambió la ubicación y hay ubicacionId, geocodifico; si no, uso las anteriores
      let coords: { lat: number | null; lng: number | null } = {
        lat: originalLocationRef.current.lat,
        lng: originalLocationRef.current.long,
      };
      if (locationDirty && ubicacionId) {
        const fetched = await obtenerCoordenadas(ubicacionId); // debe traer { lat, lng }
        coords = {
          lat: typeof fetched?.lat === 'number' ? fetched.lat : coords.lat,
          lng: typeof fetched?.lng === 'number' ? fetched.lng : coords.lng,
        };
      }

      // Imagen
      let finalImageURL = imageURL;
      let finalImageID = imageID;
      if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri);
        finalImageURL = upload.image_url;
        finalImageID = upload.image_id;
        setImageURL(finalImageURL);
        setImageID(finalImageID);
      }

      // Normalizar HH:mm y capturar errores de formato antes de enviar
      let startHHMM: string;
      let endHHMM: string;
      try {
        startHHMM = toHHMM(horaInicio);
        endHHMM = toHHMM(horaFin);
      } catch (e: any) {
        setErrorMessage(e?.message || 'Hora inválida. Usa HH:mm');
        setShowError(true);
        setLoading(false);
        return;
      }

      // Armar payload base
      const payload: any = {
        name: nombreEvento,
        description: descripcionEvento,
        location: ubicacionEvento,
        category_id: selectedRubro ? Number(selectedRubro.id) : null,
        start_date: dateToBackendDDMMYYYY(fechaInicioEvento),
        end_date: dateToBackendDDMMYYYY(fechaFinEvento),
        start_time: startHHMM, // HH:mm
        end_time: endHHMM,     // HH:mm
        profile_image_id: finalImageID,
        profile_image_url: finalImageURL,
      };

      // Solo incluir lat/lng si son números válidos (no pisar con null)
      if (typeof coords.lat === 'number' && Number.isFinite(coords.lat)) {
        payload.latitude = coords.lat;
      }
      if (typeof coords.lng === 'number' && Number.isFinite(coords.lng)) {
        payload.longitude = coords.lng;
      }
      await requestBackend(`/api/events/update/${eventIdNum}/`, payload, 'PUT');
      setShowSuccess(true);
      router.replace('/employer')
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (baja lógica estado=6)
  const handleEliminarEvento = () => setMostrarConfirmEliminar(true);

  const confirmarEliminar = async () => {
    try {
      await requestBackend(`/api/events/update/${eventIdNum}/state/`, 6, 'PATCH');
      setMostrarConfirmEliminar(false);
      setShowSuccess(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setMostrarConfirmEliminar(false);
      setErrorMessage(getApiErrorMessage(err));
      setShowError(true);
    }
  };

  const cancelarEliminar = () => setMostrarConfirmEliminar(false);

  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  const seleccionarUbicacion = (item: { descripcion: string; placeId: string }) => {
    setUbicacionEvento(item.descripcion);
    setUbicacionId(item.placeId);
    setSugerencias([]);
    Keyboard.dismiss();
  };

  return {
    nombreEvento,
    sugerencias,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    horaInicio,
    horaFin,
    rubros,
    selectedRubro,
    imageID,
    imageURL,
    setImagenFile,
    setSelectedRubro,
    seleccionarUbicacion,
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
