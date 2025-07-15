import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const useRegistroMail = (desdeGoogle = false) => {
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seguridad, setSeguridad] = useState<'Débil' | 'Media' | 'Fuerte' | null>(null);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const evaluarSeguridad = (pass: string) => {
    if (!pass) return setSeguridad(null);
    const tieneSimbolos = /[A-Z0-9.!@#$%^&*]/.test(pass);
    if (pass.length >= 8 && tieneSimbolos) setSeguridad('Fuerte');
    else if (pass.length >= 8) setSeguridad('Media');
    else setSeguridad('Débil');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    evaluarSeguridad(value);
  };

  // Regex para solo @gmail.com o @hotmail.com
  const validarCorreo = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
};

  const handleContinue = async () => {
    // Validaciones
    if (!validarCorreo(correo)) {
      setErrorMessage('Formato de mail inválido.');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      setShowError(true);
      return;
    }

    try {
      const datosParciales: any = {
        correo,
        password,
      };

      await SecureStore.setItemAsync('registro-parcial', JSON.stringify(datosParciales));

    router.push('./seleccion-tipo');

    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    const habilitado = correo && password && confirmPassword;
    setContinuarHabilitado(Boolean(habilitado));
  }, [correo, password, confirmPassword]);

  return {
    correo,
    setCorreo,
    password,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    seguridad,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    closeSuccess,
  };
};