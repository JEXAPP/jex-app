import { config } from '@/config';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

export const useRecuperar3 = () => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGuardar = async () => {
    if (password.trim() === '' || confirmPassword.trim() === '') {
      setErrorMessage('Completá ambos campos');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('recuperar-token');
      if (!token) throw new Error('Token no encontrado');

      const response = await fetch(`${config.apiBaseUrl}/api/auth/password-reset-confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nuevaContrasena: password,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo cambiar la contraseña');
      }

      setShowModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    router.push('/login');
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    handleGuardar,
    showModal,
    closeModal,
    showError,
    errorMessage,
    closeError,
  };
};
