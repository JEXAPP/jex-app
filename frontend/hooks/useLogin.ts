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

  // Hook para manejar la conexión con el backend
  const { requestBackend } = useBackendConection(); // ya no hay loading aquí
  const [loading, setLoading] = useState(false);

  // Estados para el login tradicional
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para mostrar contraseña con el ojito
  const [mostrarPassword, setMostrarPassword] = useState(false);

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

    setLoading(true); 
    try {
      const data = await requestBackend(
        '/api/auth/login/jwt/',
        { email, password },
        'POST' 
      );
        
      await SecureStore.setItemAsync('access', data.access);
        
      await SecureStore.setItemAsync('refresh', data.refresh);

      setSuccessMessage('Sesión iniciada correctamente');
      setShowSuccess(true);

      setTimeout(async () => {
        setShowSuccess(false);
        await handleLoginToken();
      }, 1500);

    } catch(error) {

      console.log(error)
      setErrorMessage('Correo o contraseña incorrectos');
      setShowError(true);

    } finally {
      
      setLoading(false); 
    }
  };

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

      console.log('Error al iniciar sesión con Google:', err);

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

    setLoading(true);
    try {
      const res = await requestBackend(
        '/api/auth/login/google/',
        { access_token: accessToken },
        'POST'
      );

      if (res?.access) {
        const { access, refresh, incomplete_user } = res;
        await SecureStore.setItemAsync('access', access);
        await SecureStore.setItemAsync('refresh', refresh);

        setSuccessMessage('Sesión iniciada correctamente');
        setShowSuccess(true);

        setTimeout(async () => {
          setShowSuccess(false);
          if (incomplete_user) {
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
        router.push('/employer/vacancy/edit-vacancy');
      } else {
        // rol inválido o no presente → ir al selector de tipo de usuario
        router.replace('/auth/register/type-user');
      }
    } catch (error) {
      console.log('Token inválido:', error);
      router.replace('/');
    }
  };

  // Navega al registro normal (no por Google)
  const handleNavigateToRegister = async () => {
    await SecureStore.setItemAsync('desde-google', 'false');
    router.push('/auth/register');
  };

  // Navega a la pantalla para recuperar contraseña
  const handlePasswordForgot = () => {
    router.push('/auth/reset-password');
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
    mostrarPassword,
    setMostrarPassword,
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
