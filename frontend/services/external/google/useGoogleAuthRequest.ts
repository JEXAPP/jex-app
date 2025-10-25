import { config } from '@/config';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

type GoogleAuthResult = {
  accessToken: string | null;
  code: string | null;
  idToken: string | null;
  email?: string;
};

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export function useGoogleAuthRequest() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Previene errores de warmUpAsync en web
  useEffect(() => {
    try {
      WebBrowser.maybeCompleteAuthSession();
    } catch {}
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setReady(true);
      return;
    }

    GoogleSignin.configure({
      webClientId: config.google.clientIdWeb,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    (async () => {
      try {
        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // ---- Nativo ----
  const signInNative = useCallback(async (): Promise<GoogleAuthResult | null> => {
    const res = await GoogleSignin.signIn();
    if (!isSuccessResponse(res)) return null;
    const { data } = res;

    let accessToken: string | null = null;
    if (Platform.OS === 'android') {
      try {
        const tokens = await GoogleSignin.getTokens();
        accessToken = tokens?.accessToken ?? null;
      } catch {
        accessToken = null;
      }
    }

    return {
      accessToken,
      code: data.serverAuthCode ?? null,
      idToken: data.idToken ?? null,
      email: data.user?.email,
    };
  }, []);

  // ---- Web ----
  const signInWeb = useCallback(async (): Promise<GoogleAuthResult | null> => {
    // Versión moderna: usa AuthSession.startAsync no existe más,
    // ahora se usa AuthSession.AuthRequest + promptAsync
    const redirectUri = AuthSession.makeRedirectUri();

    const request = new AuthSession.AuthRequest({
      clientId: config.google.clientIdWeb,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    });

    await request.makeAuthUrlAsync(GOOGLE_DISCOVERY);

    const result = await request.promptAsync(GOOGLE_DISCOVERY);

    if (result.type !== 'success') return null;

    return {
      accessToken: null,
      code: result.params?.code ?? null,
      idToken: result.params?.id_token ?? null,
      email: undefined,
    };
  }, []);

  const signIn = useCallback(async (): Promise<GoogleAuthResult | null> => {
    if (!ready || loading) return null;
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        return await signInWeb();
      }
      return await signInNative();
    } catch (e: any) {
      if (Platform.OS !== 'web' && isErrorWithCode(e)) {
        if (e.code === statusCodes.SIGN_IN_CANCELLED) return null;
        if (e.code === statusCodes.IN_PROGRESS) return null;
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, [ready, loading, signInNative, signInWeb]);

  const signOut = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      await GoogleSignin.signOut();
    } catch {}
  }, []);

  return { signIn, signOut, ready, loading };
}
