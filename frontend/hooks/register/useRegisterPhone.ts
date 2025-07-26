import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import useBackendConection from '@/services/useBackendConection';
import { useDataValidation } from '@/services/useDataValidation';

export const useRegisterPhone = (desdeGoogle = false) => {
  const router = useRouter();
  const { requestBackend } = useBackendConection(); // Hook para hacer requests al backend
  const { validateCodeArea } = useDataValidation(); // Hook para validar el código de área

  // Estados para manejar los inputs
  const [codigoArea, setCodigoArea] = useState('');
  const [telefono, setTelefono] = useState('');
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Estados para errores
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado para modal de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para formatear el número de teléfono
  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/[^0-9]/g, '');
    if (limpio.length <= 7) {
      const conGuion = limpio.length > 3 ? limpio.slice(0, 3) + '-' + limpio.slice(3) : limpio;
      setTelefono(conGuion);
    }
  };

  // Elimina ceros iniciales del código de área
  const normalizarCodigo = (codigo: string) => {
    return codigo.replace(/^0+/, '');
  };

  // Maneja el flujo al tocar el botón de continuar
  const handleContinue = async () => {
    const telefonoLimpio = telefono.replace('-', '');
    const codigoNormalizado = normalizarCodigo(codigoArea);

    if (codigoArea.length < 1) {
      setErrorMessage('Debés ingresar un código de área');
      setShowError(true);
      return;
    }

    // Valida si el código pertenece a Argentina
    if (!validateCodeArea(codigoNormalizado)) {
      setErrorMessage('Código de Área no válido');
      setShowError(true);
      return;
    }

    if (telefonoLimpio.length < 7) {
      setErrorMessage('El número de teléfono debe tener al menos 7 dígitos');
      setShowError(true);
      return;
    }

    try {
      const telefonoCompleto = `+54${codigoNormalizado}${telefonoLimpio}`;

      // Request al backend para enviar SMS (comentado si todavía no se implementó)
      await requestBackend('/api/auth/verify/send-code/', { phone: telefonoCompleto }, 'POST');

      // Guarda el teléfono en el almacenamiento seguro
      const datosParciales = { phone: telefonoLimpio };
      await SecureStore.setItemAsync('registro-telefono', JSON.stringify(datosParciales));

      // Redirige a pantalla de validación del código SMS
      router.push('./register/code-validation');

    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  // Cierra el mensaje de error
  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  // Cierra el modal de éxito si se implementa uno
  const closeSuccess = () => {
    setShowSuccess(false);
  };

  // Activa o desactiva el botón de continuar
  useEffect(() => {
    const telefonoLimpio = telefono.replace('-', '');
    const habilitado = codigoArea.length > 0 && telefonoLimpio.length >= 7;
    setContinuarHabilitado(habilitado);
  }, [codigoArea, telefono]);

  return {
    codigoArea,
    setCodigoArea,
    telefono,
    setTelefono: handleTelefonoChange,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess
  };
};
