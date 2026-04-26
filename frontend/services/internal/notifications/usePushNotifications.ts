import { useCallback, useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { secureGet, secureSet, secureDelete } from '@/services/internal/secureStorage';
import { ensureAndroidChannels, setupCategories } from '@/services/internal/notifications/notifications';
import useBackendConection from '@/services/internal/useBackendConection';
import { logger } from '@/services/internal/logger';

type RegisterOptions = { authToken?: string };
const SECURESTORE_KEY = 'expo_push_token';

async function getProjectId(): Promise<string | undefined> {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId ??
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
      // Push notifications are a native-only feature — not available on web
      if (Platform.OS === 'web') return null;

      if (!Device.isDevice) {
        logger.warn('[PN] no es dispositivo físico — omitiendo registro');
        return null;
      }

      await ensureAndroidChannels();
      await setupCategories();

      const current = await Notifications.getPermissionsAsync();
      let status = current.status;

      if (status !== Notifications.PermissionStatus.GRANTED) {
        const req = await Notifications.requestPermissionsAsync();
        status = req.status;
      }

      setPermissionStatus(status);
      if (status !== Notifications.PermissionStatus.GRANTED) {
        logger.warn('[PN] permiso denegado');
        return null;
      }

      const projectId = await getProjectId();
      const tokenObj = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      const token = tokenObj.data;
      setExpoPushToken(token);

      // Only POST to backend if the token changed since last registration
      const prev = await secureGet(SECURESTORE_KEY);
      if (prev === token) return token;

      await secureSet(SECURESTORE_KEY, token);

      try {
        await requestBackend(
          `/api/notifications/devices/register/`,
          { expo_push_token: token },
          'POST',
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (e: unknown) {
        logger.warn('[PN] error registrando token en backend:', (e as Error).message);
      }

      return token;
    },
    [requestBackend]
  );

  // Notification listeners — native only
  useEffect(() => {
    if (Platform.OS === 'web') return;
    notificationListener.current = Notifications.addNotificationReceivedListener((_n) => {});
    responseListener.current = Notifications.addNotificationResponseReceivedListener((_r) => {});
    return () => {
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  const clearStoredToken = useCallback(async () => {
    await secureDelete(SECURESTORE_KEY);
    setExpoPushToken(null);
  }, []);

  return {
    expoPushToken,
    permissionStatus,
    registerForPushNotificationsAsync,
    clearStoredToken,
  };
}
