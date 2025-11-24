import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';

export const useChangePasswordThree = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validatePassword } = useDataValidation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGuardar = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
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

    if (!isPasswordValid) {
      setErrorMessage('La contraseña no cumple con los requisitos mínimos');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      await requestBackend(
        '/api/auth/change-password/',
        { new_password: password },
        'PUT',
        { useAuth: true }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/employee/profile');
      }, 1500);
    } catch (error: any) {
      const msg = error?.error || error?.detail || 'Ocurrió un error';
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const closeError = () => {
    setShowError(false);
    setErrorMessage('');
  };

  const closeSuccess = () => setShowSuccess(false);

  useEffect(() => {
    setContinuarHabilitado(password.length > 0 && confirmPassword.length > 0);
  }, [password, confirmPassword]);

  return {
    password,
    confirmPassword,
    mostrarPassword,
    mostrarConfirmPassword,
    setMostrarPassword,
    setMostrarConfirmPassword,
    loading,
    continuarHabilitado,
    showSuccess,
    showError,
    errorMessage,
    handleGuardar,
    setPassword,
    setConfirmPassword,
    closeError,
    closeSuccess,
    setIsPasswordValid,
  };
};
