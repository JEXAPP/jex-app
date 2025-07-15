import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const useRegistroEmpleador = () => {
  const router = useRouter();

  const [nombreEmpresa, setNombreEmpresa] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [registroPrevio, setRegistroPrevio] = useState<any>(null);
  const [desdeGoogle, setDesdeGoogle] = useState(false);
  const [googleToken, setGoogleToken] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const parcial = await SecureStore.getItemAsync('registro-parcial');
        const token = await SecureStore.getItemAsync('google-token');

        if (parcial) setRegistroPrevio(JSON.parse(parcial));
        if (token) {
          setDesdeGoogle(true);
          setGoogleToken(token);
        }
      } catch (err) {
        setErrorMessage('No se pudo recuperar información de registro previa');
        setShowError(true);
      }
    };

    cargarDatos();
  }, []);

  const validarCampos = () => {
    if (!nombreEmpresa ) {
      setErrorMessage('El nombre de la Empresa es obligatorio');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleRegistrarEmpleador = async () => {
    if (!validarCampos()) return;
    if (!registroPrevio) {
      setErrorMessage('No se encontró información previa del registro');
      setShowError(true);
      return;
    }

    const payload = {
      nombreEmpresa,
      tipoUsuario: 'Empleador',
      ...registroPrevio,
    };

    try {
      if (desdeGoogle) {
        await axios.post('https://tu-api.com/auth/google/register', {
          tokenGoogle: googleToken,
          datosAdicionales: payload,
        });
      } else {
        await axios.post('https://tu-api.com/auth/register', payload);
      }

      setShowSuccess(true);
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo completar el registro';
      setErrorMessage(mensaje);
      setShowError(true);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('../crear-evento');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    nombreEmpresa,
    handleRegistrarEmpleador,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    setNombreEmpresa
  };
};
