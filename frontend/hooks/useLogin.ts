import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useGoogleAuthRequest } from '@/services/useGoogleAuthRequest';


export const useLogin = () => {
  const router = useRouter();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados de error
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados de éxito
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Lógica para iniciar sesión con email y contraseña.
  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      setShowError(true);
      return;
    }

    // Simulación de login exitoso
    setSuccessMessage('Sesión iniciada correctamente');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      router.push('/');
    }, 1500);
  };

  // Redirige a la pantalla de registro.
  const handleNavigateToRegister = () => {
    router.push('/registro');
  };

  // Cierra modales
  const closeError = () => setShowError(false);
  const closeSuccess = () => setShowSuccess(false);

  // Hook para login con Google
  const { request, handleGoogleLogin } = useGoogleAuthRequest({
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
  };
};
