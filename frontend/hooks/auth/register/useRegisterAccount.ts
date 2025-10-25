import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export const useRegisterAccount = () => {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { validateEmail } = useDataValidation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  const handlePasswordChange = (value: string) => setPassword(value);

  const handleContinue = async () => {
    if (!validateEmail(correo)) { setErrorMessage('Formato de mail inválido.'); setShowError(true); return; }
    if (password !== confirmPassword) { setErrorMessage('Las contraseñas no coinciden'); setShowError(true); return; }
    if (passwordStrength < 3) { setErrorMessage('La contraseña es demasiado débil'); setShowError(true); return; }

    const qs = new URLSearchParams({ google: '0', phone: phone || '', email: correo, password }).toString();
    router.push(`./type-user?${qs}`);
  };

  const closeError = () => { setErrorMessage(''); setShowError(false); };

  useEffect(() => {
    setContinuarHabilitado(Boolean(correo && password && confirmPassword));
  }, [correo, password, confirmPassword]);

  return {
    correo, setCorreo,
    password, handlePasswordChange,
    confirmPassword, setConfirmPassword,
    desdeGoogle: false, // este paso no existe con Google
    continuarHabilitado, handleContinue,
    showError, errorMessage, closeError,
    mostrarPassword, setMostrarPassword,
    mostrarConfirmPassword, setMostrarConfirmPassword,
    passwordStrength, setPasswordStrength,
  };
};
