// Manejo de autenticación con Google y navegación
import { GOOGLE_ANDROID_CLIENT_ID } from '@env';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';

// Completa cualquier sesión de autenticación pendiente al abrir la app
WebBrowser.maybeCompleteAuthSession();

interface UseGoogleAuthRequestProps {
  setErrorMessage: (msg: string) => void;
  setShowSuccess: (v: boolean) => void;
  setShowError: (v: boolean) => void;
  setSuccessMessage: (msg: string) => void;
}

export const useGoogleAuthRequest = ({
  setErrorMessage,
  setShowSuccess,
  setShowError,
  setSuccessMessage
}: UseGoogleAuthRequestProps) => {

  // Configura la solicitud de autenticación con los datos del cliente
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: '',
    redirectUri: makeRedirectUri({ scheme: 'frontend' }),
  });

  // Efecto que se activa cuando se recibe una respuesta de autenticación
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      // (Opcional) Token de autenticación recibido
      console.log('TOKEN:', authentication?.accessToken);

      // Muestra modal de éxito y redirige a la pantalla principal
      setSuccessMessage('Sesión con Google iniciada');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 1500);
    }
  }, [response, setShowSuccess, setSuccessMessage]);

  return { request, promptAsync };
};
