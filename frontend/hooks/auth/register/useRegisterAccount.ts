import { useDataValidation } from '@/services/internal/useDataValidation';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export const useRegisterAccount = (desdeGoogle = false) => {
  const router = useRouter();
  const { validateEmail } = useDataValidation(); // Trae la función de validación de email

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para mostrar/ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);


  // Maneja el cambio de la contraseña y actualiza su seguridad
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  // Lógica que se ejecuta al presionar el botón continuar
  const handleContinue = async () => {
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

    if (passwordStrength < 3) {
      setErrorMessage('La contraseña es demasiado débil');
      setShowError(true);
      return;
    }

    try {
      // Guarda los datos ingresados temporalmente
      const datosParciales: any = {
        email: correo,
        password: password,
      };

      await SecureStore.setItemAsync('registro-parcial', JSON.stringify(datosParciales));

      // Navega a la pantalla de selección de tipo de cuenta
      router.push('./type-user');

    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
      setShowError(true);
    }
  };

  // Cierra el mensaje de error
  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };


  // Actualiza si el botón de continuar debe estar habilitado
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
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    passwordStrength,
    setPasswordStrength
    
  };
};
