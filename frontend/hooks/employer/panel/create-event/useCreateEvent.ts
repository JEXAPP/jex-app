import { useUploadImageServ } from '@/services/external/cloudinary/useUploadImage';
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type UploadableImage = {
  uri: string;
  name: string;
  type: string;
};

export const useCreateEvent = () => {
  const router = useRouter();
  
  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { requestBackend} = useBackendConection();
  const [loading, setLoading] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<UploadableImage | null>(null);
  const { uploadImage } = useUploadImageServ();
  

  // Rubros
  const [rubros, setRubros] = useState<{ id: number; name: string }[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<{ id: number | string; name: string } | null>(null);
  const [loadingRubros, setLoadingRubros] = useState(true);
  const [errorRubros, setErrorRubros] = useState<string | null>(null);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await requestBackend('/api/events/categories/', null, 'GET');
        setRubros(response);
      } catch (err) {
        console.log('Error al obtener rubros:', err);
        setErrorRubros('No se pudieron cargar los rubros');
      } finally {
        setLoadingRubros(false);
      }
    };
    fetchRubros();
  }, []);

  const handleUbicacion = (texto: string, coord: {lat: number, lng: number}) => { setUbicacionEvento(texto); setCoords(coord); };

  //#region Validación de campos
  const validarCampos = () => {
    if (!nombreEvento || !descripcionEvento || !fechaInicioEvento || !fechaFinEvento || !ubicacionEvento || !horaInicio || !horaFin) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }
    //#endregion

    //#region Validación de fechas
    if (new Date(fechaInicioEvento) > new Date(fechaFinEvento)) {
      setErrorMessage('La Fecha de Inicio debe ser menor o igual a la Fecha de Fin');
      setShowError(true);
      return false;
    }

    return true;
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

    // Controla si el botón continuar está habilitado
  useEffect(() => {
    const habilitado =
      nombreEvento.length > 0 &&
      descripcionEvento.length > 0 &&
      ubicacionEvento.length > 0 &&
      fechaInicioEvento != null &&
      fechaFinEvento != null &&
      horaInicio != null &&
      horaFin != null &&
      selectedRubro != null
    setContinuarHabilitado(habilitado);
  }, [nombreEvento, descripcionEvento, ubicacionEvento, fechaInicioEvento, fechaFinEvento, horaFin, horaInicio, selectedRubro]);

  const handleCrearEvento = async () => {
    // Validación de campos del formulario
    if (!validarCampos()) return;

    setLoading(true)
    try {
      const lat = coords?.lat
      const lng = coords?.lng

      const fechaInicioFormateada = fechaInicioEvento ? `${fechaInicioEvento.getDate().toString().padStart(2, '0')}/${(fechaInicioEvento.getMonth() + 1).toString().padStart(2, '0')}/${fechaInicioEvento.getFullYear()}`: ''
      const fechaFinFormateada = fechaFinEvento ? `${fechaFinEvento.getDate().toString().padStart(2, '0')}/${(fechaFinEvento.getMonth() + 1).toString().padStart(2, '0')}/${fechaFinEvento.getFullYear()}`: ''

      // Preparamos el payload con todos los datos del evento
    const payload: {
      name: string;
      description: string;
      location: string;
      latitude: number;
      longitude: number;
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
      latitude: lat!,
      longitude: lng!,
      start_date: fechaInicioFormateada,
      end_date: fechaFinFormateada,
      start_time: horaInicio,
      end_time: horaFin,
      category_id: selectedRubro?.id,
      profile_image_id: null,
      profile_image_url: null,
    };


     if (imagenFile) {
        const upload = await uploadImage(imagenFile.uri);
        payload.profile_image_url = upload.image_url;
        payload.profile_image_id = upload.image_id;
      }

      // Enviamos al backend
      const data = await requestBackend('/api/events/create/', payload, 'POST');

      const idEventoCreado = data.id

      setShowSuccess(true);
      // Si fue exitoso, mostramos mensaje de éxito
      router.replace(`/employer/panel/vacancy/create-vacancy?id=${idEventoCreado}&fechaInicio=${fechaInicioFormateada}&fechaFin=${fechaFinFormateada}`);
      //router.replace(`./create-vacancy?id=${idEventoCreado}&fechaInicio=${fechaInicioFormateada}&fechaFin=${fechaFinFormateada}`)
      
    } catch (error: any) {
      // Manejo de errores
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
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    handleCrearEvento,
    handleUbicacion,
    setHoraInicio,
    setHoraFin,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    rubros,
    selectedRubro,
    setSelectedRubro,
    loadingRubros,
    errorRubros,
    continuarHabilitado,
    setImagenFile,
    imagenPerfil,
    setImagenPerfil
  };
};
