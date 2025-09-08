import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export const useRegisterEmployer = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const { validateText } = useDataValidation();

  // Estado para el nombre de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');

  // Estado de error y éxito
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado para habilitar el botón continuar
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Estado para guardar datos del registro previo (guardado en SecureStore)
  const [registroPrevio, setRegistroPrevio] = useState<any>(null);

  // Estado si el usuario vino desde Google
  const [desdeGoogle, setDesdeGoogle] = useState(false);
  const [googleToken, setGoogleToken] = useState('');

  // Carga de datos previamente guardados en SecureStore
  useEffect(() => {
    const cargarDatos = async () => {

      try {
        const telefono = await SecureStore.getItemAsync('registro-telefono');
        const datosGuardados = await SecureStore.getItemAsync('registro-parcial');
        const token = await SecureStore.getItemAsync('google-token');

        if (datosGuardados && telefono) {
          const telefonoParseado = JSON.parse(telefono); 
          setRegistroPrevio({
            ...JSON.parse(datosGuardados),
            phone: telefonoParseado.phone // 👈 solo el string limpio
          });
        }

        if (token) {
          setDesdeGoogle(true);
          setGoogleToken(token);
        }

      } catch (err) {
        console.log('Hubo un error al cargar información previa:', err)
        setErrorMessage('No se pudo recuperar información de registro previa');
        setShowError(true);
      }
    };

    cargarDatos();
  }, []);

  // Valida campos antes de enviar al backend
  const validarCampos = () => {
    if (!nombreEmpresa.trim()) {
      setErrorMessage('El nombre de la Empresa es obligatorio');
      setShowError(true);
      return false;
    }

    if (!validateText(nombreEmpresa)) {
      setErrorMessage('El nombre contiene caracteres inválidos');
      setShowError(true);
      return false;
    }

    return true;
  };

  // Maneja el envío de registro al backend según método (Google o tradicional)
  const handleRegistrarEmpleador = async () => {
    if (!validarCampos()) return;

    if (!registroPrevio) {
      setErrorMessage('No se encontró información previa del registro');
      setShowError(true);
      return;
    }

    const payload = {
      company_name: nombreEmpresa,
      ...registroPrevio,
    };

    setLoading(true);

    try {
      if (desdeGoogle) {
        await requestBackend('/api/auth/google/register', {
          tokenGoogle: googleToken,
          datosAdicionales: payload,
        }, 'POST');
      } else {
        await requestBackend('/api/auth/register/employer/', payload, 'POST');
      }

      setLoading(false);
      setShowSuccess(true);

    } catch (err) {
      // Si el backend falla, mostrar el mensaje de error
      console.log('Hubo un error al completar el registro:', err)
      setErrorMessage('No se pudo completar el registro');
      setShowError(true);
    }
  };

  // Cierra el modal de éxito y redirige a crear evento
  const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/employer');
  };

  // Cierra el modal de error
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Actualiza si el botón de continuar debe estar habilitado
  useEffect(() => {
    const habilitado = nombreEmpresa.length > 0;
    setContinuarHabilitado(habilitado);
  }, [nombreEmpresa]);

  return {
    nombreEmpresa,
    continuarHabilitado,
    handleRegistrarEmpleador,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess,
    setNombreEmpresa,
    loading
  };
};
