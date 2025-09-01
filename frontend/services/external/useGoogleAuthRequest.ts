import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { config } from '@/config';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuthRequest = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Usa tu scheme definido en app.json -> "expo": { "scheme": "jex" }
  const redirectUri = makeRedirectUri({ scheme: 'jex' });

  // ClientId por plataforma (sin proxy)
  const clientId =
    Platform.select({
      ios: config.google.clientIdIOS,
      android: config.google.clientIdAndroid,
      web: config.google.clientIdWeb, // solo si corrés en web
    }) ?? '';

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken ?? null;
      if (token) setAccessToken(token);
    }
  }, [response]);

  return {
    request,
    promptAsync,
    accessToken,
    googleSuccess: response?.type === 'success',
    googleError: response?.type === 'error',
  };
};
