import { useUploadImageServ } from '@/services/external/cloudinary/useUploadImage';
import useBackendConection, { getApiErrorMessage } from '@/services/internal/useBackendConection';
import { obtenerCoordenadasDesdeDireccion } from '@/services/external/sugerencias/useGeoRefAr';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Option = { id: number | string; name: string };
type UploadableImage = { uri: string; name: string; type: string };

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

// Normaliza a HH:mm (24h). Acepta "9:5", "09:05", etc.
const toHHMM = (s: string): string => {
  const m = s?.match?.(/^(\d{1,2}):(\d{1,2})(?::\d{1,2})?$/);
  if (!m) throw new Error('Hora inválida. Usa HH:mm');
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59)
    throw new Error('Hora fuera de rango (00:00–23:59)');
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const useEditEvent = () => {
  const { uploadImage } = useUploadImageServ();
  const { requestBackend } = useBackendConection();
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const eventIdStr = Array.isArray(id) ? id[0] : id;
  const eventIdNum = Number(eventIdStr);

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [rubros, setRubros] = useState<Option[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Option | null>(null);

  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageID, setImageID] = useState<string | null>(null);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  const originalLocationRef = useRef<{ location: string; lat: number | null; lng: number | null }>({
    location: '',
    lat: null,
    lng: null,
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

  // ---- Cargar rubros ----
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

  // ---- Cargar detalle del evento ----
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
      setHoraInicio((data?.start_time ?? '').slice(0, 5));
      setHoraFin((data?.end_time ?? '').slice(0, 5));
      setImageURL(data?.event_image_url ?? null);
      setImageID(data?.event_image_public_id ?? null);

      const cat = data?.category;
      setSelectedRubro(cat ? { id: cat.id, name: cat.name } : null);

      const latNum = parseFloat(data?.latitud ?? data?.latitude ?? '');
      const lngNum = parseFloat(data?.longitud ?? data?.longitude ?? '');

      originalLocationRef.current = {
        location: data?.location ?? '',
        lat: Number.isFinite(latNum) ? latNum : null,
        lng: Number.isFinite(lngNum) ? lngNum : null,
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

  // ---- Ubicación seleccionada ----
  const handleUbicacion = (texto: string, coord: { lat: number; lng: number } | null) => {
    setUbicacionEvento(texto);
    setCoords(coord);
    setLocationDirty(true);
  };

  // ---- Guardar cambios ----
  const handleEditarEvento = async () => {
    if (!guardarHabilitado) return;
    setLoading(true);

    try {
      let lat = originalLocationRef.current.lat;
      let lng = originalLocationRef.current.lng;

      // Si la ubicación cambió, obtenemos nuevas coordenadas (si no vinieron del picker)
      if (locationDirty) {
        if (coords?.lat && coords?.lng) {
          lat = coords.lat;
          lng = coords.lng;
        } else {
          const { lat: lat2, lon: lon2 } = await obtenerCoordenadasDesdeDireccion({
            canonical: ubicacionEvento,
          });
          lat = lat2 ?? null;
          lng = lon2 ?? null;
        }
      }

      // Imagen nueva
      let finalImageURL = imageURL;
      let finalImageID = imageID;
      if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri, 'events-images');
        finalImageURL = upload.image_url;
        finalImageID = upload.image_id;
        setImageURL(finalImageURL);
        setImageID(finalImageID);
      }

      // Normalizar HH:mm
      let startHHMM = toHHMM(horaInicio);
      let endHHMM = toHHMM(horaFin);

      // Payload final
      const payload: any = {
        name: nombreEvento,
        description: descripcionEvento,
        location: ubicacionEvento,
        category_id: selectedRubro ? Number(selectedRubro.id) : null,
        start_date: dateToBackendDDMMYYYY(fechaInicioEvento),
        end_date: dateToBackendDDMMYYYY(fechaFinEvento),
        start_time: startHHMM,
        end_time: endHHMM,
        profile_image_id: finalImageID,
        profile_image_url: finalImageURL,
      };

      if (lat != null && lng != null) {
        payload.latitude = lat;
        payload.longitude = lng;
      }

      await requestBackend(`/api/events/update/${eventIdNum}/`, payload, 'PUT');
      setShowSuccess(true);
      router.replace('/employer');
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // ---- Eliminar evento ----
  const handleEliminarEvento = () => setMostrarConfirmEliminar(true);
  const confirmarEliminar = async () => {
    try {
      await requestBackend(`/api/events/delete/${eventIdNum}/`, null, 'DELETE');
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
    imageID,
    imageURL,
    setImagenFile,
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
