import { useGoogleAuthRequest } from '@/services/external/useGoogleAuthRequest';
import { usePushNotifications } from '@/services/internal/notifications/usePushNotifications';
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
  const { registerForPushNotificationsAsync } = usePushNotifications();
  const { requestBackend } = useBackendConection();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Del hook Google: usamos promptAsync y tomamos el token directamente del resultado
  const { promptAsync } = useGoogleAuthRequest();

  // Guarda tokens (acepta "access" o "access_token", idem refresh)
  const saveTokens = async (data: any) => {
    const access = data?.access || data?.access_token;
    const refresh = data?.refresh || data?.refresh_token;
    if (access) await SecureStore.setItemAsync('access', access);
    if (refresh) await SecureStore.setItemAsync('refresh', refresh);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      // 1) Autenticación credenciales
      const data = await requestBackend(
        '/api/auth/login/jwt/',
        { email: email.trim(), password: password.trim() },
        'POST'
      );

      await saveTokens(data);

      // 2) Registrar push SIN romper el login si falla
      try {
        await SecureStore.deleteItemAsync('expo_push_token'); // fuerza re-POST
        await registerForPushNotificationsAsync();
      } catch (e: any) {
        console.warn(
          'No se pudo registrar push (no bloquea login):',
          e?.response?.data || e?.message || e
        );
      }

      // 3) Feedback + navegación
      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);
      setTimeout(async () => {
        setShowSuccess(false);
        await handleLoginToken();
      }, 800);
    } catch (e: any) {
      const status = e?.response?.status;
      const path = e?.config?.url;
      console.log('Error en login:', status, path, e?.response?.data || e?.message);

      if (path?.includes('/api/auth/login/jwt/') && (status === 400 || status === 401)) {
        setErrorMessage('Correo o contraseña incorrectos');
      } else {
        setErrorMessage('Error al iniciar sesión. Intentalo de nuevo.');
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Google en un solo paso: tomar el accessToken directo de promptAsync()
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success' || !result.authentication?.accessToken) {
        if (result.type === 'cancel') {
          setErrorMessage('Inicio cancelado');
        } else {
          setErrorMessage('No se pudo obtener el token de Google');
        }
        setShowError(true);
        return;
      }

      const gToken = result.authentication.accessToken;

      const res = await requestBackend(
        '/api/auth/login/google/',
        { access_token: gToken },
        'POST'
      );

      if (!res?.access && !res?.access_token) {
        setErrorMessage('Error al autenticar con el servidor');
        setShowError(true);
        return;
      }

      await saveTokens(res);

      // registrar push sin bloquear
      try {
        await SecureStore.deleteItemAsync('expo_push_token'); // fuerza re-POST
        await registerForPushNotificationsAsync();
      } catch (e: any) {
        console.warn(
          'No se pudo registrar push (no bloquea login):',
          e?.response?.data || e?.message || e
        );
      }

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
      }, 800);
    } catch (e: any) {
      const status = e?.response?.status;
      const path = e?.config?.url;
      console.log('Error en login Google:', status, path, e?.response?.data || e?.message);

      if (path?.includes('/api/auth/login/google/') && (status === 400 || status === 401)) {
        setErrorMessage('Error al autenticar con el servidor');
      } else {
        setErrorMessage('Error al iniciar sesión con Google');
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginToken = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access');
      if (!accessToken) throw new Error('No access token');
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const role = decoded.role;

      if (role === 'employee') {
        router.push('/employee/test');
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
