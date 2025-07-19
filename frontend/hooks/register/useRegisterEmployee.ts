import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useGooglePlacesAutocomplete from '@/services/useGooglePlacesAutocomplete';
import { Keyboard } from 'react-native';
import { useDataValidation } from '@/services/useDataValidation';
import useBackendConection from '@/services/useBackendConection';

export const useRegisterEmployee = () => {
  const router = useRouter();
  const { validateText, validateAge } = useDataValidation();
  const { requestBackend } = useBackendConection();

  // Estados para campos de entrada
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [ubicacion, setUbicacion] = useState<string>('');

  // Estados para control de errores y éxito
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Estados que traen datos de pasos anteriores
  const [registroPrevio, setRegistroPrevio] = useState<any>(null);
  const [desdeGoogle, setDesdeGoogle] = useState(false);
  const [googleToken, setGoogleToken] = useState('');

  // Lógica para autocompletar ubicaciones con Google
  const {
    sugerencias,
    setSugerencias,
    cargando,
    error,
    buscarSugerencias,
  } = useGooglePlacesAutocomplete();

  // Manejador de cambios para ubicación
  const handleUbicacion = (texto: string) => {
    setUbicacion(texto);
    buscarSugerencias(texto);
  };

  // Selección de ubicación desde sugerencias
  const seleccionarUbicacion = (valor: string) => {
    setUbicacion(valor);
    setSugerencias([]);
    Keyboard.dismiss();
  };

  // Formatea la fecha en formato DD/MM/YYYY
  const formatearFecha = (fecha: Date): string => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // Formatea el DNI con puntos mientras se escribe
  const handleChangeDni = (text: string) => {
    let limpio = text.replace(/\D/g, '');
    if (limpio.length > 8) limpio = limpio.slice(0, 8);

    let conPuntos = limpio;
    if (limpio.length > 3 && limpio.length <= 6) {
      conPuntos = limpio.slice(0, limpio.length - 3) + '.' + limpio.slice(-3);
    } else if (limpio.length > 6) {
      conPuntos =
        limpio.slice(0, limpio.length - 6) +
        '.' +
        limpio.slice(limpio.length - 6, limpio.length - 3) +
        '.' +
        limpio.slice(-3);
    }

    setDni(conPuntos);
  };

  // Carga datos persistentes al iniciar el componente
  useEffect(() => {
    const cargarDatosPrevios = async () => {
      try {
        const telefono = await SecureStore.getItemAsync('registro-telefono');
        const datosGuardados = await SecureStore.getItemAsync('registro-parcial');
        const tokenGoogle = await SecureStore.getItemAsync('google-token');

        if (datosGuardados && telefono) {
          setRegistroPrevio({
            ...JSON.parse(datosGuardados),
            phone: telefono,
          });
        }

        if (tokenGoogle) {
          setDesdeGoogle(true);
          setGoogleToken(tokenGoogle);
        }
      } catch (error) {
        setErrorMessage('No se pudo recuperar la información previa');
        setShowError(true);
      }
    };

    cargarDatosPrevios();
  }, []);

  // Controla si el botón continuar está habilitado
  useEffect(() => {
    const habilitado =
      nombre.length > 0 &&
      apellido.length > 0 &&
      dni.length > 0 &&
      ubicacion.length > 0 &&
      fechaNacimiento != null;
    setContinuarHabilitado(habilitado);
  }, [nombre, apellido, dni, ubicacion, fechaNacimiento]);

    const validarCampos = () => {
    if (!nombre || !apellido || !ubicacion) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }

    // Validar nombre y apellido con caracteres válidos
    if (!validateText(nombre) || !validateText(apellido)) {
      setErrorMessage('Nombre o Apellido contienen caracteres inválidos');
      setShowError(true);
      return false;
    }

    // Validar que el DNI tenga al menos 7 números
    if (!dni || dni.replace(/\D/g, '').length < 7) {
      setErrorMessage('El DNI no es válido');
      setShowError(true);
      return false;
    }

    // Validar fecha seleccionada
    if (!fechaNacimiento) {
      setErrorMessage('Debés seleccionar tu fecha de nacimiento');
      setShowError(true);
      return false;
    }

    // Validar que tenga al menos 16 años
    if (!validateAge(fechaNacimiento)) {
      setErrorMessage('Debés tener al menos 16 años para registrarte');
      setShowError(true);
      return false;
    }

    return true;
  };

    const handleRegistrarEmpleado = async () => {
    // Validación de los campos del formulario
    if (!validarCampos()) return;

    // Validamos que haya datos previos del registro
    if (!registroPrevio) {
      setErrorMessage('No se encontró la información previa del registro');
      setShowError(true);
      return;
    }

    // Preparamos el payload con todos los datos del usuario
    const payload = {
      first_name: nombre,
      last_name: apellido,
      address: ubicacion,
      dni: dni.replace(/\./g, ''),
      birth_date: formatearFecha(fechaNacimiento!),
      ...registroPrevio,
    };

    try {
      // Si viene de Google, usamos otro endpoint
      if (desdeGoogle) {
        await requestBackend('/api/auth/google/register', {
          tokenGoogle: googleToken,
          datosAdicionales: payload
        }, 'POST');
      } else {
        await requestBackend('/api/auth/register/employee/', payload, 'POST');
      }

      // Mostramos modal de éxito
      setShowSuccess(true);

    } catch (error: any) {
      // Captura y muestra de errores del servidor
      const mensaje = error?.response?.data?.message || 'No se pudo completar el registro';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  // Cierra el modal de éxito y redirige a la home
  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/');
  };

  // Cierra el modal de error
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Exposición de los valores y handlers necesarios para el componente
  return {
    nombre,
    apellido,
    continuarHabilitado,
    setNombre,
    setApellido,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    dni,
    fechaNacimiento,
    handleChangeDni,
    setFechaNacimiento,
    ubicacion,
    handleUbicacion,
    seleccionarUbicacion,
    sugerencias,
    cargando,
    error,
  };
};
