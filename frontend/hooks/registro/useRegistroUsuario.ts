import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const useRegistroUsuario = (desdeGoogle = false) => {
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [codigoArea, setCodigoArea] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seguridad, setSeguridad] = useState<'Débil' | 'Media' | 'Fuerte' | null>(null);
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/[^0-9]/g, '');
    if (limpio.length <= 7) {
      const conGuion = limpio.length > 3 ? limpio.slice(0, 3) + '-' + limpio.slice(3) : limpio;
      setTelefono(conGuion);
    }
  };

  const handleContinue = async () => {
  const telefonoCompleto = `${codigoArea}${telefono.replace('-', '')}`;

  try {
    const response = await fetch('https://tu-backend.com/api/enviar-sms-registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono: telefonoCompleto }),
    });

    if (!response.ok) {
      throw new Error('No se pudo enviar el SMS');
    }

    const { token } = await response.json();
    await SecureStore.setItemAsync('registro-token', token);

    // Guardar la info previa para el siguiente paso
    const datosParciales: any = {
      telefono: telefonoCompleto,
    };

    if (!desdeGoogle) {
      datosParciales.correo = correo;
      datosParciales.password = password;
    }

    await SecureStore.setItemAsync('registro-parcial', JSON.stringify(datosParciales));

    router.push('./registro/validar-telefono');

  } catch (error: any) {
    setErrorMessage(error.message || 'Ocurrió un error inesperado');
    setShowError(true);
  }
  };

  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  useEffect(() => {
    const habilitado = correo && codigoArea && telefono && password && confirmPassword;
    setContinuarHabilitado(Boolean(habilitado));
  }, [correo, codigoArea, telefono, password, confirmPassword]);

  return {
    correo,
    setCorreo,
    codigoArea,
    setCodigoArea,
    telefono,
    setTelefono: handleTelefonoChange,
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
  };
};
