import useBackendConection from '@/services/useBackendConection';
import { useGoogleAuthRequest } from '@/services/useGoogleAuthRequest';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

export const useLogin = () => {
  const router = useRouter();

  // Hook para manejar la conexión con el backend
  const { requestBackend, loading } = useBackendConection();

  // Estados para el login tradicional
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para mostrar errores
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para mostrar éxito
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Hook para la autenticación con Google
  const { promptAsync, accessToken } = useGoogleAuthRequest();

  // Maneja el login tradicional con email y contraseña
  const handleLogin = async () => {

    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return;
    }

    const data = await requestBackend('/api/auth/login/jwt/', { email, password });

    if (data?.access) {
      await SecureStore.setItemAsync('access', data.access);
      await SecureStore.setItemAsync('refresh', data.refresh);

      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/create-event');
      }, 1500);

    } else {
      setErrorMessage('Correo o contraseña incorrectos');
      setShowError(true);
    };
  }

  // Orquesta el flujo de login con Google (auth + backend)
  const handleGoogle = async () => { 
    await handleGoogleAuth();      
    await handleGoogleLogin(); 
  };

  // Inicia el flujo de autenticación con Google
  const handleGoogleAuth = async () => {
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error('Login cancelado por el usuario');
      }
    } catch (err) {
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    }
  };

  // Envía el token de Google al backend para obtener los tokens JWT propios
  const handleGoogleLogin = async () => {

    if (!accessToken) {
      setErrorMessage('No se pudo obtener el token de Google');
      setShowError(true);
      return;
    }

    const res = await requestBackend('/api/auth/login/google/', {
      access_token: accessToken,
    });

    if (res?.access) {
      const { access, refresh, incomplete_user } = res;

      await SecureStore.setItemAsync('access_token', access);
      await SecureStore.setItemAsync('refresh_token', refresh);

      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);

      setTimeout(async () => {
        setShowSuccess(false);
        if (incomplete_user) {
          await SecureStore.setItemAsync('desde-google', 'true');
          router.push('./register');
        } else {
          router.push('./create-event');
        }
      }, 1500);

    } else {
      setErrorMessage('Error al autenticar con el servidor');
      setShowError(true);
    }
  };

  // Navega al registro normal (no por Google)
  const handleNavigateToRegister = async () => {
    await SecureStore.setItemAsync('desde-google', 'false');
    router.push('./register');
  };

  // Navega a la pantalla para recuperar contraseña
  const handlePasswordForgot = () => {
    router.push('./reset-password');
  };

  // Cierra el modal de error
  const closeError = () => setShowError(false);

  // Cierra el modal de éxito
  const closeSuccess = () => setShowSuccess(false);

  return {
    email,
    password,
    loading,
    showError,
    errorMessage,
    showSuccess,
    successMessage,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    closeError,
    closeSuccess,
    handleGoogle,
    handlePasswordForgot
  };
};
