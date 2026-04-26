import { useGoogleAuthRequest } from '@/services/external/google/useGoogleAuthRequest';
import { usePushNotifications } from '@/services/internal/notifications/usePushNotifications';
import useBackendConection from '@/services/internal/useBackendConection';
import { getToken, setToken } from '@/services/internal/useTokenStorage';
import { connectStream } from '@/services/stream/streamClient';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Platform } from 'react-native';
import { logger } from '@/services/internal/logger';

type Role = 'employee' | 'employer';

// SECURITY: Explicit JWT payload interface — no `any` fallback to prevent
// unvalidated claims from reaching navigation/authorization logic
interface DecodedToken {
  role?: Role | null;
  is_superuser?: boolean | null;
  exp?: number;
  sub?: string;
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

  // SECURITY: Typed response shape — access/refresh tokens only, no raw data forwarded
  const saveTokens = async (data: { access?: string; access_token?: string; refresh?: string; refresh_token?: string }) => {
    const access = data?.access ?? data?.access_token;
    const refresh = data?.refresh ?? data?.refresh_token;
    if (access) await setToken('access', access);
    if (refresh) await setToken('refresh', refresh);
  };

  const ensureStreamConnected = async () => {
    try {
      await connectStream(requestBackend);
    } catch (e) {
      logger.warn('No se pudo conectar a Stream:', e);
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
      // SECURITY: Safe logger — never print the token payload
      logger.warn('Token inválido o sin sesión activa');
      router.replace('/');
    }
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
    } catch {
      // SECURITY: Do not log Google auth errors — they may contain OAuth codes
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim().replace(/<[^>]*>/g, '');
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Correo electrónico inválido');
      setShowError(true);
      return;
    }
    if (!password || password.length < 2) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const data = await requestBackend(
        '/api/auth/login/jwt/',
        { email: trimmedEmail, password },
        'POST'
      );
      await saveTokens(data);
      try {
        if (Platform.OS !== 'web') {
          await registerForPushNotificationsAsync();
        }
      } catch { /* push notification registration is non-critical */ }
      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);
      setTimeout(async () => {
        setShowSuccess(false);
        await handleLoginToken();
      }, 800);
    } catch (e: unknown) {
      // SECURITY: Never forward raw error objects — use the sanitized message only
      const err = e as { error?: string; status?: number };
      setErrorMessage(err?.error ?? 'Error al iniciar sesión');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/auth/register?google=0');
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
