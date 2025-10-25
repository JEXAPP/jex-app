// src/services/internal/notifications/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const ANDROID_CHANNELS = {
  default: 'default',
  offers: 'offers',
  alerts: 'alerts',
} as const;

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      // iOS banner/list only
      shouldShowBanner: Platform.OS === 'ios',
      shouldShowList: Platform.OS === 'ios',
    }),
  });
}

/** Crear/actualizar TODOS los canales Android una sola vez */
export async function ensureAndroidChannels() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNELS.default, {
    name: 'General',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
    vibrationPattern: [0, 150, 100, 150],
    lightColor: '#64278C',
  });

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNELS.offers, {
    name: 'Ofertas',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 200, 150, 200],
    lightColor: '#64278C',
  });

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNELS.alerts, {
    name: 'Alertas',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 400, 200, 400],
    lightColor: '#64278C',
  });
}

/** Registrar categorías (botones) para iOS/Android */
export async function setupCategories() {
  await Notifications.setNotificationCategoryAsync('JEX_OFFER', [
    { identifier: 'ACCEPT', buttonTitle: 'Aceptar', options: { opensAppToForeground: true } },
    { identifier: 'REJECT', buttonTitle: 'Rechazar', options: { opensAppToForeground: false } },
  ]);
}
