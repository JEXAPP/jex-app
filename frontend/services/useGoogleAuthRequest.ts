import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { config } from '@/config';


WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuthRequest = () => {
  
  // Estado para guardar el accessToken de Google
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Inicializa la solicitud de autenticación con Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.google.clientIdAndroid,
    iosClientId: config.google.clientIdIOS,
    webClientId: config.google.clientIdWeb,
    redirectUri: makeRedirectUri(),
  });

  // Si la respuesta es exitosa, guarda el accessToken
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setAccessToken(authentication.accessToken);
      }
    }
  }, [response]);

  return {
    request,
    promptAsync,
    accessToken, // Token obtenido desde Google si el login fue exitoso
    googleSuccess: response?.type === 'success', // Indica si el login fue exitoso
    googleError: response?.type === 'error',     // Indica si ocurrió un error
  };
};
