import { useState, useEffect } from 'react';
import useGooglePlaces from '@/services/useGooglePlaces';
import { Keyboard } from 'react-native';
import useBackendConection from '@/services/useBackendConection';

export const useCreateEvent = () => {

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState<string | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);
  const [ubicacionEvento, setUbicacionEvento] = useState('');
  const [ubicacionId, setUbicacionId] = useState('');
  const { sugerencias, setSugerencias, buscarSugerencias, obtenerCoordenadas } = useGooglePlaces();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { requestBackend, loading } = useBackendConection();
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Rubros
  const [rubros, setRubros] = useState<{ id: number; name: string }[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<{ id: number | string; name: string } | null>(null);
  const [loadingRubros, setLoadingRubros] = useState(true);
  const [errorRubros, setErrorRubros] = useState<string | null>(null);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await requestBackend('/api/events/categories/', {}, 'GET');
        setRubros(response);
      } catch (err) {
        console.error('Error al obtener rubros:', err);
        setErrorRubros('No se pudieron cargar los rubros');
      } finally {
        setLoadingRubros(false);
      }
    };
    fetchRubros();
  }, []);

  const handleUbicacion = (texto: string) => {
    setUbicacionEvento(texto);
    buscarSugerencias(texto);
  };

  const seleccionarUbicacion = (item: { descripcion: string; placeId: string }) => {
    setUbicacionEvento(item.descripcion);
    setUbicacionId(item.placeId);
    setSugerencias([]);
    Keyboard.dismiss();
  };

  //#region Validación de campos
  const validarCampos = () => {
    if (!nombreEvento || !descripcionEvento || !fechaInicioEvento || !fechaFinEvento || !ubicacionEvento || !horaInicio || !horaFin) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }
    //#endregion

    //#region Validación de fechas
    if (new Date(fechaInicioEvento) >= new Date(fechaFinEvento)) {
      setErrorMessage('La fecha de inicio debe ser anterior a la fecha de fin');
      setShowError(true);
      return false;
    }
    //#endregion

    if (!ubicacionId) {
      setErrorMessage('Debés seleccionar una ubicación válida');
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

    try {
      // Obtenemos las coordenadas a partir del placeId
      const coords = await obtenerCoordenadas(ubicacionId);

      const fechaInicioFormateada = fechaInicioEvento ? `${fechaInicioEvento.getDate().toString().padStart(2, '0')}/${(fechaInicioEvento.getMonth() + 1).toString().padStart(2, '0')}/${fechaInicioEvento.getFullYear()}`: ''
      const fechaFinFormateada = fechaFinEvento ? `${fechaFinEvento.getDate().toString().padStart(2, '0')}/${(fechaFinEvento.getMonth() + 1).toString().padStart(2, '0')}/${fechaFinEvento.getFullYear()}`: ''

      // Preparamos el payload con todos los datos del evento
      const payload = {
        name: nombreEvento,
        description: descripcionEvento,
        location: ubicacionEvento,
        latitude: coords.lat,
        longitude: coords.lng,
        start_date: fechaInicioFormateada,
        end_date: fechaFinFormateada,
        start_time: horaInicio,
        end_time: horaFin,
        category_id: selectedRubro?.id,
      };

      console.log(payload)

      // Enviamos al backend
      await requestBackend('/api/events/create/', payload, 'POST');

      // Si fue exitoso, mostramos mensaje de éxito
      setShowSuccess(true);

    } catch (error: any) {
      // Manejo de errores
      const mensaje = error?.response?.data?.message || 'No se pudo crear el evento';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  return {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    sugerencias,
    horaInicio,
    horaFin,
    loading,
    seleccionarUbicacion,
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
    continuarHabilitado
  };
};
