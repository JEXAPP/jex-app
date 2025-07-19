import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/useBackendConection';
import { useDataValidation } from '@/services/useDataValidation';

export const useNewPassword = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validatePassword } = useDataValidation();

  // Estados para campos de contraseña y confirmación
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado para controlar si se muestra el modal de éxito
  const [showModal, setShowModal] = useState(false);

  // Estados para errores y control de habilitación del botón
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  // Función que guarda la nueva contraseña en el backend
  const handleGuardar = async () => {
    if (password.trim() === '' || confirmPassword.trim() === '') {
      setErrorMessage('Completá ambos campos');
      setShowError(true);
      return;
    }

    // Verifica que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }

    // Valida el formato de la contraseña con los caracteres permitidos
    if (!validatePassword(password)) {
      setErrorMessage('La contraseña contiene caracteres no permitidos');
      setShowError(true);
      return;
    }

    try {
      const email = await SecureStore.getItemAsync('email-password-reset');
      if (!email) throw new Error('Email no encontrado');

      const codigo = await SecureStore.getItemAsync('code');

      const res = await requestBackend('/api/auth/password-reset-complete/', {
        email,
        otp_code: codigo,
        new_password: password
      }, 'POST');

      if (!res) throw new Error('No se pudo cambiar la contraseña');

      setShowModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  // Cierra el modal y redirige al login
  const closeModal = () => {
    setShowModal(false);
    router.push('/login');
  };

  // Cierra el error y limpia el mensaje
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Activa el botón continuar si ambos campos están completos
  useEffect(() => {
    const habilitado = password.length > 0 && confirmPassword.length > 0;
    setContinuarHabilitado(habilitado);
  }, [password, confirmPassword]);

  return {
    password,
    confirmPassword,
    setPassword,
    continuarHabilitado,
    setConfirmPassword,
    handleGuardar,
    showModal,
    closeModal,
    showError,
    errorMessage,
    closeError,
  };
};
