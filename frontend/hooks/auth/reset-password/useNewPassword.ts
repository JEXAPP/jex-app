import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';

export const useNewPassword = () => {

  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const { validatePassword } = useDataValidation();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);


  // Estados para campos de contraseña y confirmación
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado para controlar si se muestra el modal de éxito
  const [showSuccess, setShowSuccess] = useState(false);

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
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage('La contraseña contiene caracteres no permitidos');
      setShowError(true);
      return;
    }
    if (passwordStrength < 2) {
      setErrorMessage('La contraseña es demasiado débil');
      setShowError(true);
      return;
    }

    setLoading(true); 
    try {
      const email = await SecureStore.getItemAsync('email-password-reset');
      if (!email) throw new Error('Email no encontrado');

      const codigo = await SecureStore.getItemAsync('code');

      await requestBackend(
        '/api/auth/password-reset-complete/',
        { email, otp_code: codigo, new_password: password },
        'POST' 
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Cierra el error y limpia el mensaje
  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  // Cierra el modal de éxito
  const closeSuccess = () => setShowSuccess(false);

  // Activa el botón continuar si ambos campos están completos
  useEffect(() => {
    const habilitado = password.length > 0 && confirmPassword.length > 0;
    setContinuarHabilitado(habilitado);
  }, [password, confirmPassword]);

  return {
    password,
    loading,
    confirmPassword,
    showSuccess,
    showError,
    errorMessage,
    continuarHabilitado,
    mostrarPassword,
    mostrarConfirmPassword,
    setMostrarPassword,
    setMostrarConfirmPassword,
    setConfirmPassword,
    handleGuardar,
    setPassword,
    closeError,
    closeSuccess,
    setPasswordStrength
  };
};
