import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import useGooglePlacesAutocomplete from '@/services/useGooglePlacesAutocomplete';
import { Keyboard } from 'react-native';
import { config } from '@/config';

export const useRegistroEmpleado = () => {
  const router = useRouter();

  // Estados de campos de esta etapa
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  // Estados de control
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados persistentes de etapas anteriores
  const [registroPrevio, setRegistroPrevio] = useState<any>(null);
  const [desdeGoogle, setDesdeGoogle] = useState(false);
  const [googleToken, setGoogleToken] = useState('');

  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);

  const [ubicacion, setUbicacion] = useState<string>('');

  const {
    sugerencias,
    setSugerencias,
    cargando,
    error,
    buscarSugerencias,
  } = useGooglePlacesAutocomplete();

  const handleUbicacion = (texto: string) => {
    setUbicacion(texto);
    buscarSugerencias(texto); // No hace falta limitar desde acá
  };

  const seleccionarUbicacion = (valor: string) => {
    setUbicacion(valor);
    setSugerencias([]); // ⬅️ Esto fuerza el cierre de la lista
    Keyboard.dismiss(); // ⬅️ Esto cierra el teclado
  };

  const formatearFecha = (fecha: Date): string => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };


  // Función para formatear el DNI mientras se escribe
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

  const validarEdad = (fecha: Date | null) => {
    if (!fecha) return false;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad >= 16;
  };

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
          })};
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

  const validarCampos = () => {
    if (!nombre || !apellido || !ubicacion) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return false;
    }
    if (!dni || dni.replace(/\D/g, '').length < 7) {
      setErrorMessage('El DNI no es válido');
      setShowError(true);
      return false;
    }

    if (!fechaNacimiento) {
      setErrorMessage('Debés seleccionar tu fecha de nacimiento');
      setShowError(true);
      return false;
    }

    if (!validarEdad(fechaNacimiento)) {
      setErrorMessage('Debés tener al menos 16 años para registrarte');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleRegistrarEmpleado = async () => {
    if (!validarCampos()) return;
    if (!registroPrevio) {
      setErrorMessage('No se encontró la información previa del registro');
      setShowError(true);
      return;
    }

    const payload = {
      first_name: nombre,
      last_name: apellido,
      address: ubicacion,
      dni: dni.replace(/\./g, ''),
      birth_date: formatearFecha(fechaNacimiento!),
      ...registroPrevio,
    };

    try {
      if (desdeGoogle) {
        await axios.post(`${config.apiBaseUrl}/api/auth/google/register`, {
          tokenGoogle: googleToken,
          datosAdicionales: payload
        });
      } else {
        await axios.post(`${config.apiBaseUrl}/api/auth/register/employee/`, payload);
      }

      setShowSuccess(true);
    } catch (error: any) {
      const mensaje = error?.response?.data?.message || 'No se pudo completar el registro';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    nombre,
    apellido,
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
