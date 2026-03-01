import { useCallback, useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { ensureAndroidChannels, setupCategories } from '@/services/internal/notifications/notifications';
import useBackendConection from '@/services/internal/useBackendConection';

type RegisterOptions = { authToken?: string };
const SECURESTORE_KEY = 'expo_push_token';

async function getProjectId(): Promise<string | undefined> {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ||
    (Constants as any).easConfig?.projectId ||
    process.env.EAS_PROJECT_ID
  );
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.PermissionStatus | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const { requestBackend } = useBackendConection();

  const registerForPushNotificationsAsync = useCallback(
    async (_opts?: RegisterOptions) => {
      console.log('[PN] start');

      if (!Device.isDevice) {
        console.warn('[PN] no es dispositivo físico');
        return null;
      }

      // Android: asegurar canal
      await ensureAndroidChannels();
      await setupCategories();

      // Permisos (iOS/Android)
      const current = await Notifications.getPermissionsAsync();
      let status = current.status;
      console.log('[PN] permiso actual:', status);

      if (status !== Notifications.PermissionStatus.GRANTED) {
        const req = await Notifications.requestPermissionsAsync();
        status = req.status;
        console.log('[PN] permiso solicitado:', status);
      }

      setPermissionStatus(status);
      if (status !== Notifications.PermissionStatus.GRANTED) {
        console.warn('[PN] permiso denegado');
        return null;
      }

      // Token Expo (iOS/Android)
      const projectId = await getProjectId();
      console.log('[PN] projectId:', projectId);

      const tokenObj = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      const token = tokenObj.data;
      console.log('[PN] expo token:', token);
      setExpoPushToken(token);

      // Persistir y POSTear al backend solo si cambió
      const prev = await SecureStore.getItemAsync(SECURESTORE_KEY);
      console.log('[PN] prev token:', prev);

      if (prev === token) {
        console.log('[PN] token igual → no POST');
        return token;
      }

      await SecureStore.setItemAsync(SECURESTORE_KEY, token);

      try {
        console.log('[PN] POST /api/notifications/devices/register/');
        await requestBackend(
          `/api/notifications/devices/register/`,
          { expo_push_token: token },
          'POST',
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('[PN] POST OK');
      } catch (e: any) {
        console.warn('[PN] POST error:', e?.response?.status, e?.response?.data || e?.message);
      }

      return token;
    },
    [requestBackend]
  );

  // Listeners (foreground + tap)
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((_n) => {});
    responseListener.current = Notifications.addNotificationResponseReceivedListener((_r) => {});
    return () => {
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  const clearStoredToken = useCallback(async () => {
    await SecureStore.deleteItemAsync(SECURESTORE_KEY);
    setExpoPushToken(null);
  }, []);

  return {
    expoPushToken,
    permissionStatus,
    registerForPushNotificationsAsync,
    clearStoredToken,
  };
}
