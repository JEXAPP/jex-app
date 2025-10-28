import { useUploadImageServ } from '@/services/external/cloudinary/useUploadImage';
import useBackendConection from '@/services/internal/useBackendConection';
import { obtenerCoordenadasDesdeDireccion } from '@/services/external/sugerencias/useGeoRefAr';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

export const useCreateEvent = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { uploadImage } = useUploadImageServ();

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);

  const [rubros, setRubros] = useState<{ id: number; name: string }[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<{ id: number | string; name: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Rubros ---
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await requestBackend('/api/events/categories/', null, 'GET');
        setRubros(response);
      } catch (err) {
        console.log('Error al obtener rubros:', err);
      }
    };
    fetchRubros();
  }, []);

  // --- Manejo de ubicación ---
  const handleUbicacion = (texto: string, coord: { lat: number; lng: number } | null) => {
    setUbicacionEvento(texto);
    setCoords(coord);
  };

  // --- Validaciones ---
  const validarCampos = () => {
    if (
      !nombreEvento ||
      !descripcionEvento ||
      !fechaInicioEvento ||
      !fechaFinEvento ||
      !ubicacionEvento ||
      !horaInicio ||
      !horaFin
    ) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }

    if (new Date(fechaInicioEvento) > new Date(fechaFinEvento)) {
      setErrorMessage('La Fecha de Inicio debe ser menor o igual a la Fecha de Fin');
      setShowError(true);
      return false;
    }

    return true;
  };

  const closeSuccess = () => setShowSuccess(false);
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Habilitación del botón
  useEffect(() => {
    const habilitado =
      nombreEvento.length > 0 &&
      descripcionEvento.length > 0 &&
      ubicacionEvento.length > 0 &&
      fechaInicioEvento != null &&
      fechaFinEvento != null &&
      horaInicio != null &&
      horaFin != null &&
      selectedRubro != null;
    setContinuarHabilitado(habilitado);
  }, [
    nombreEvento,
    descripcionEvento,
    ubicacionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    horaInicio,
    horaFin,
    selectedRubro,
  ]);

  // --- Crear Evento ---
  const handleCrearEvento = async () => {
    if (!validarCampos()) return;
    setLoading(true);

    try {
      let lat = coords?.lat;
      let lng = coords?.lng;

      // Si no hay coords aún, las buscamos ahora:
      if (!lat || !lng) {
        const { lat: lat2, lon: lon2 } = await obtenerCoordenadasDesdeDireccion({
          canonical: ubicacionEvento,
        });
        lat = lat2 ?? undefined;
        lng = lon2 ?? undefined;
      }

      const fechaInicioFormateada = fechaInicioEvento
        ? `${fechaInicioEvento.getDate().toString().padStart(2, '0')}/${(
            fechaInicioEvento.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}/${fechaInicioEvento.getFullYear()}`
        : '';
      const fechaFinFormateada = fechaFinEvento
        ? `${fechaFinEvento.getDate().toString().padStart(2, '0')}/${(
            fechaFinEvento.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}/${fechaFinEvento.getFullYear()}`
        : '';

      const payload: {
        name: string;
        description: string;
        location: string;
        latitude: number | null;
        longitude: number | null;
        start_date: string;
        end_date: string;
        start_time: string | null;
        end_time: string | null;
        category_id: number | string | undefined;
        profile_image_id: string | null;
        profile_image_url: string | null;
      } = {
        name: nombreEvento,
        description: descripcionEvento,
        location: ubicacionEvento,
        latitude: lat ?? null,
        longitude: lng ?? null,
        start_date: fechaInicioFormateada,
        end_date: fechaFinFormateada,
        start_time: horaInicio,
        end_time: horaFin,
        category_id: selectedRubro?.id,
        profile_image_id: null,
        profile_image_url: null,
      };

      if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri, 'events-images');
        payload.profile_image_url = upload.image_url;
        payload.profile_image_id = upload.image_id;
      }

      const data = await requestBackend('/api/events/create/', payload, 'POST');
      const idEventoCreado = data.id;

      setShowSuccess(true);
      router.replace(
        `/employer/panel/vacancy/create-vacancy?id=${idEventoCreado}&fechaInicio=${fechaInicioFormateada}&fechaFin=${fechaFinFormateada}`
      );
    } catch (error: any) {
      const mensaje = error?.response?.data?.message || 'No se pudo crear el evento';
      setErrorMessage(mensaje);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    horaInicio,
    horaFin,
    loading,
    continuarHabilitado,
    rubros,
    selectedRubro,
    imagenPerfil,
    imagenFile,
    showError,
    showSuccess,
    errorMessage,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    setHoraInicio,
    setHoraFin,
    setSelectedRubro,
    setImagenFile,
    setImagenPerfil,
    handleUbicacion,
    handleCrearEvento,
    closeError,
    closeSuccess,
  };
};
