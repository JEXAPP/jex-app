import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const useRegistroEmpleado = () => {
  const router = useRouter();

  // Estados de campos de esta etapa
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // Estados de control
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados persistentes de etapas anteriores
  const [registroPrevio, setRegistroPrevio] = useState<any>(null);
  const [desdeGoogle, setDesdeGoogle] = useState(false);
  const [googleToken, setGoogleToken] = useState('');

  useEffect(() => {
    const cargarDatosPrevios = async () => {
      try {
        const datosGuardados = await SecureStore.getItemAsync('registro-parcial');
        const tokenGoogle = await SecureStore.getItemAsync('google-token');

        if (datosGuardados) setRegistroPrevio(JSON.parse(datosGuardados));
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
      nombre,
      apellido,
      ubicacion,
      tipoUsuario: 'Empleado',
      ...registroPrevio,
    };

    try {
      if (desdeGoogle) {
        await axios.post('https://tu-api.com/auth/google/register', {
          tokenGoogle: googleToken,
          datosAdicionales: payload
        });
      } else {
        await axios.post('https://tu-api.com/auth/register', payload);
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
    ubicacion,
    setNombre,
    setApellido,
    setUbicacion,
    handleRegistrarEmpleado,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
  };
};
