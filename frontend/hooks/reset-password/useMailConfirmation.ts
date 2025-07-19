import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/useBackendConection';
import { useDataValidation } from '../../services/useDataValidation';

export const useMailConfirmation = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateEmail } = useDataValidation();

  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Envía el correo para recuperación si es válido
  const handleEnviarCorreo = async () => {

    if (!validateEmail(email)) {

      setErrorMessage('Correo electrónico inválido');
      setShowError(true);
      return;

    }

    const res = await requestBackend('/api/auth/password-reset/', { email }, 'POST');

    if (!res) {
      setErrorMessage('No pudimos procesar ese correo. Verificá que sea válido.');
      setShowError(true);
      return;
    }

    await SecureStore.setItemAsync('email-password-reset', email);

    router.push('./reset-password/code-validation');
  };

  // Cierra el modal de error
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Habilita el botón de continuar si hay algo escrito
  useEffect(() => {
    const habilitado = email.length > 0;
    setContinuarHabilitado(habilitado);
  }, [email]);

  return {
    email,
    showError,
    continuarHabilitado,
    errorMessage,
    setEmail,
    closeError,
    handleEnviarCorreo,
  };
};
