import { useGoogleAuthRequest } from '@/services/external/useGoogleAuthRequest';
import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

type Role = 'employee' | 'employer';

interface DecodedToken {
  role?: Role | null;
  [key: string]: any;
}

export const useLogin = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { promptAsync, accessToken } = useGoogleAuthRequest();

  // 👇 helper para guardar tokens con soporte para ambas variantes
  const saveTokens = async (data: any) => {
    const access = data.access || data.access_token;
    const refresh = data.refresh || data.refresh_token;
    if (access) {
      await SecureStore.setItemAsync('access', access);
    }
    if (refresh) {
      await SecureStore.setItemAsync('refresh', refresh);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const data = await requestBackend(
        '/api/auth/login/jwt/',
        { email, password },
        'POST'
      );

      await saveTokens(data);

      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);

      setTimeout(async () => {
        setShowSuccess(false);
        await handleLoginToken();
      }, 1500);
    } catch (error) {
      console.log(error);
      setErrorMessage('Correo o contraseña incorrectos');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await handleGoogleAuth();
    await handleGoogleLogin();
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error('Login cancelado por el usuario');
      }
    } catch (err) {
      console.log('Error al iniciar sesión con Google:', err);
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    }
  };

  const handleGoogleLogin = async () => {
    if (!accessToken) {
      setErrorMessage('No se pudo obtener el token de Google');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await requestBackend(
        '/api/auth/login/google/',
        { access_token: accessToken },
        'POST'
      );

      if (res?.access || res?.access_token) {
        await saveTokens(res);

        setSuccessMessage('Sesión iniciada correctamente');
        setShowSuccess(true);

        setTimeout(async () => {
          setShowSuccess(false);
          if (res?.incomplete_user) {
            await SecureStore.setItemAsync('desde-google', 'true');
            router.push('/auth/register');
          } else {
            await handleLoginToken();
          }
        }, 1500);
      } else {
        setErrorMessage('Error al autenticar con el servidor');
        setShowError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginToken = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access');
      const decoded = jwtDecode<DecodedToken>(accessToken!);
      const role = decoded.role;

      if (role === 'employee') {
        router.push('/employee');
      } else if (role === 'employer') {
        router.push('/employer');
      } else {
        router.replace('/auth/register/type-user');
      }
    } catch (error) {
      console.log('Token inválido:', error);
      router.replace('/');
    }
  };

  const handleNavigateToRegister = async () => {
    await SecureStore.setItemAsync('desde-google', 'false');
    router.push('/auth/register');
  };

  const handlePasswordForgot = () => {
    router.push('/auth/reset-password');
  };

  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  return {
    email,
    password,
    loading,
    showError,
    errorMessage,
    showSuccess,
    successMessage,
    mostrarPassword,
    setMostrarPassword,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    closeError,
    closeSuccess,
    handleGoogle,
    handlePasswordForgot,
  };
};
