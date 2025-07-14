import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useGoogleAuthRequest } from '@/services/useGoogleAuthRequest';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const useLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return;
    }

    try {
      const response = await axios.post('https://TU_BACKEND_URL/api/login', {
        email,
        password,
      });

      const { token, necesitaRegistro } = response.data;

      await SecureStore.setItemAsync('jwt', token);

      if (necesitaRegistro) {
        await SecureStore.setItemAsync('desde-google', 'true');
        router.push('/registro');
      } else {
        setSuccessMessage('Sesión iniciada correctamente');
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          router.push('/crear-evento');
        }, 1500);
      }

    } catch (error) {
      setErrorMessage('Correo o contraseña incorrectos');
      setShowError(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const accessToken = result.authentication?.accessToken;

        const response = await axios.post('https://TU_BACKEND_URL/api/login-google', {
          tokenGoogle: accessToken,
        });

        const { token, necesitaRegistro } = response.data;

        await SecureStore.setItemAsync('jwt', token);

        if (necesitaRegistro) {
          await SecureStore.setItemAsync('desde-google', 'true');
          router.push('/registro');
        } else {
          setSuccessMessage('Sesión iniciada correctamente');
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
            router.push('/crear-evento');
          }, 1500);
        }

      } else {
        throw new Error('Login cancelado');
      }
    } catch (err) {
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    }
  };

  const handleNavigateToRegister = async () => {
    await SecureStore.setItemAsync('desde-google', 'false');
    router.push('./registro');
  };

  const handlePasswordForgot = () => {
    router.push('./login/recuperar1');
  };

  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  const { request, promptAsync } = useGoogleAuthRequest({
    setErrorMessage,
    setShowSuccess,
    setShowError,
    setSuccessMessage,
  });

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleNavigateToRegister,
    showError,
    errorMessage,
    closeError,
    showSuccess,
    successMessage,
    closeSuccess,
    handleGoogleLogin,
    request,
    handlePasswordForgot
  };
};
