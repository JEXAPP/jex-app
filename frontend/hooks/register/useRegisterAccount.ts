import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useDataValidation } from '../../services/useDataValidation';

export const useRegisterAccount = (desdeGoogle = false) => {
  const router = useRouter();
  const { validateEmail } = useDataValidation(); // Trae la función de validación de email

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seguridad, setSeguridad] = useState<'Débil' | 'Media' | 'Fuerte' | null>(null);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Evalúa la seguridad de la contraseña ingresada
  const evaluarSeguridad = (pass: string) => {
    if (!pass) return setSeguridad(null);
    const tieneSimbolos = /[A-Z0-9.!@#$%^&*]/.test(pass);
    if (pass.length >= 8 && tieneSimbolos) setSeguridad('Fuerte');
    else if (pass.length >= 8) setSeguridad('Media');
    else setSeguridad('Débil');
  };

  // Maneja el cambio de la contraseña y actualiza su seguridad
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    evaluarSeguridad(value);
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

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
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
    seguridad,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError,
    errorMessage,
    closeError
  };
};
