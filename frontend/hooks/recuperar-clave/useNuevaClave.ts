import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { config } from '../../config';

export const useNuevaClave = () => {
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
      const email = await SecureStore.getItemAsync('email-password-reset');
      if (!email) throw new Error('Email no encontrado');

      const codigo = await SecureStore.getItemAsync('code');

      const response = await fetch(`${config.apiBaseUrl}/api/auth/password-reset-complete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          otp_code: codigo,
          new_password: password,
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
