import { config } from '@/config';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
export const useRecuperar1 = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEnviarCorreo = async () => {
    if (!email.trim()) {
      setErrorMessage('Por favor, ingresá tu correo electrónico');
      setShowError(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Correo no válido');
      }

      const data = await response.json();

      // Guarda el token para las próximas etapas (usamos SecureStore)
      await SecureStore.setItemAsync('recuperar-token', data.token);

      // Navegar a la siguiente pantalla
      router.push('/login/recuperar2');
    } catch (error) {
      setErrorMessage('No pudimos procesar ese correo. Verificá que sea válido.');
      setShowError(true);
    }
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    email,
    setEmail,
    showError,
    errorMessage,
    closeError,
    handleEnviarCorreo,
  };
};
