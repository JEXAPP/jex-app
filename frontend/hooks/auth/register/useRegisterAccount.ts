import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

export const useRegisterAccount = () => {
  const { requestBackend } = useBackendConection();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { validateEmail } = useDataValidation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔄 ANTES: passwordStrength (number)
  // const [passwordStrength, setPasswordStrength] = useState(0);

  // ✅ AHORA: booleano que viene del PasswordStrengthBar
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [continuarHabilitado, setContinuarHabilitado] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  const handlePasswordChange = (value: string) => setPassword(value);

  const handleContinue = async () => {
    const emailExists = await validateEmailExists(correo);
    if (!emailExists) {
      setErrorMessage('Este correo ya está registrado.');
      setShowError(true);
      return;
    }

    if (!validateEmail(correo)) {
      setErrorMessage('Formato de mail inválido.');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }

    // 🔄 ANTES:
    // if (passwordStrength < 3) {
    //   setErrorMessage('La contraseña es demasiado débil');
    //   setShowError(true);
    //   return;
    // }

    // ✅ AHORA: usamos el booleano del componente
    if (!isPasswordValid) {
      setErrorMessage('La contraseña no cumple con los requisitos mínimos.');
      setShowError(true);
      return;
    }

    const qs = new URLSearchParams({
      google: '0',
      phone: phone || '',
      email: correo,
      password,
    }).toString();

    router.push(`./type-user?${qs}`);
  };

  const validateEmailExists = async (email: string) => {
    const payload = { email: email };
    try {
      const res = await requestBackend(`/api/auth/validate-mail/`, payload, 'POST');
      return res;
    } catch (error) {
      console.error('Error validando email:', error);
      return false;
    }
  };

  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  useEffect(() => {
    // Si querés que el botón solo se habilite cuando la contraseña es válida:
    // setContinuarHabilitado(Boolean(correo && password && confirmPassword && isPasswordValid));

    // Si querés dejarlo como antes (solo campos llenos) y validar al apretar:
    setContinuarHabilitado(Boolean(correo && password && confirmPassword));
  }, [correo, password, confirmPassword, isPasswordValid]);

  return {
    correo,
    setCorreo,
    password,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    desdeGoogle: false,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    isPasswordValid,
    setIsPasswordValid,
  };
};
