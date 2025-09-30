import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { config } from '@/config';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuthRequest = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.google.clientIdAndroid, // COMPLETO (con .apps.googleusercontent.com)
    iosClientId:     config.google.clientIdIOS,     // COMPLETO
    webClientId:     config.google.clientIdWeb,     // opcional
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setTimeout(() => WebBrowser.dismissBrowser(), 60);
      const token = response.authentication?.accessToken ?? null;
      if (token) setAccessToken(token);
    }
  }, [response]);

  return { request, promptAsync, accessToken,
    googleSuccess: response?.type === 'success',
    googleError: response?.type === 'error' ? response.error : null };
};
