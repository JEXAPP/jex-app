import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';
import { router } from 'expo-router'; // o el que uses
import { config } from '@/config'; // tu archivo de configuración
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

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
  setSuccessMessage,
}: UseGoogleAuthRequestProps) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.googleClientIdAndroid,
    iosClientId: config.googleClientIdIos,
    webClientId: config.googleExpoClientId,
    redirectUri: makeRedirectUri({
    useProxy: true,
    }),
  });

  useEffect(() => {
    const autenticarConBackend = async (googleToken: string) => {
      try {
        const res = await axios.post(`${config.apiBaseUrl}/api/auth/login/google/`, {
          access_token: googleToken,
        });

        const { access, refresh, incomplete_user } = res.data;

        console.log(res.data);
        await SecureStore.setItemAsync('access_token', access);
        await SecureStore.setItemAsync('refresh_token', refresh);


        setSuccessMessage('Sesión iniciada correctamente');
        setShowSuccess(true);


        setTimeout(async () => {
          setShowSuccess(false);
          if (incomplete_user) {
            await SecureStore.setItemAsync('desde-google', 'true');
            router.push('/registro');
          } else {
            router.push('/crear-evento');
          }
        }, 1500);
      } catch (error: any) {
        console.error('Error autenticando con backend:', error?.response?.data || error);
        setErrorMessage('Error al autenticar con el servidor');
        setShowError(true);
      }
    };

    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        autenticarConBackend(authentication.accessToken);
      } else {
        setErrorMessage('No se pudo obtener el token de Google');
        setShowError(true);
      }
    } else if (response?.type === 'error') {
      setErrorMessage('Error al iniciar sesión con Google');
      setShowError(true);
    }
  }, [response]);

  return { request, promptAsync };
};