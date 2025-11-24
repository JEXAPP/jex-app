import { useGoogleAuthRequest } from '@/services/external/google/useGoogleAuthRequest';
import { usePushNotifications } from '@/services/internal/notifications/usePushNotifications';
import useBackendConection from '@/services/internal/useBackendConection';
import { getToken, setToken } from '@/services/internal/useTokenStorage';
import { connectStream, getStreamClient } from '@/services/stream/streamClient';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Platform } from 'react-native';

type Role = 'employee' | 'employer';

interface DecodedToken {
  role?: Role | null;
  is_superuser?: boolean | null;
  [k: string]: any;
}

export const useLogin = () => {
  const router = useRouter();
  const { registerForPushNotificationsAsync } = usePushNotifications();
  const { requestBackend } = useBackendConection();
  const { signIn: googleSignIn, ready: gReady } = useGoogleAuthRequest();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const saveTokens = async (data: any) => {
    const access = data?.access || data?.access_token;
    const refresh = data?.refresh || data?.refresh_token;
    if (access) await setToken('access', access);
    if (refresh) await setToken('refresh', refresh);
  };

  const handleGoogle = async () => {
    if (!gReady) {
      setErrorMessage('Google aún se está inicializando. Probá de nuevo.');
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      const g = await googleSignIn();
      if (!g) {
        setErrorMessage('No se pudo completar el inicio de sesión con Google.');
        setShowError(true);
        return;
      }

      let res;
      if (g.accessToken) {
        res = await requestBackend(
          '/api/auth/login/google/',
          { access_token: g.accessToken },
          'POST'
        );
      } else if (g.code) {
        res = await requestBackend(
          '/api/auth/login/google/code/',
          { code: g.code },
          'POST'
        );
      } else {
        setErrorMessage('No se pudo obtener un token válido de Google.');
        setShowError(true);
        return;
      }

      await saveTokens(res);

      try {
        if (Platform.OS !== 'web') {
          await registerForPushNotificationsAsync();
        }
      } catch {}

      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);

      setTimeout(async () => {
        setShowSuccess(false);
        if (res?.incomplete_user) {
          const qs = new URLSearchParams({
            google: '1',
            ...(g.accessToken ? { gAt: g.accessToken } : {}),
            ...(g.code ? { gCode: g.code } : {}),
          }).toString();
          router.push(`/auth/register?${qs}`);
        } else {
          await handleLoginToken();
        }
      }, 800);
    } catch (e: any) {
      console.log('Error Google Sign-In:', e?.error || e);
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const ensureStreamConnected = async () => {
    try {
      await connectStream();
      const client = getStreamClient();
      void client;
    } catch (e) {
      console.log('No se pudo conectar a Stream:', e);
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
        { email: email.trim(), password: password.trim() },
        'POST'
      );
      await saveTokens(data);
      try {
        if (Platform.OS !== 'web') {
          await registerForPushNotificationsAsync();
        }
      } catch {}
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
      setErrorMessage(e?.error || 'Error al iniciar sesión');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginToken = async () => {
    try {
      const accessToken = await getToken('access');
      if (!accessToken) throw new Error('No access token');

      await ensureStreamConnected();

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const role = decoded.role;
      const isSuperuser = !!decoded.is_superuser;

      if (isSuperuser) {
        router.replace('/admin');
        return;
      }

      if (role === 'employee') {
        router.replace('/employee');
      } else if (role === 'employer') {
        router.replace('/employer');
      } else {
        router.replace('/auth/register/type-user');
      }
    } catch (error) {
      console.log('Token inválido:', error);
      router.replace('/');
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/auth/register/employer');
  };

  const handlePasswordForgot = () => router.push('/auth/reset-password');
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
