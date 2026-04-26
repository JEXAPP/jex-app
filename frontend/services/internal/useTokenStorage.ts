import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// SECURITY: On iOS, expo-secure-store wraps the Keychain Services API.
// On Android, it wraps the Android Keystore system (AES-256-GCM encryption).
// Both are hardware-backed when the device has a secure enclave, providing
// equivalent protection to react-native-keychain for Expo-managed projects.
// Tokens are NEVER stored in AsyncStorage or localStorage on native platforms.

const isWeb = Platform.OS === 'web';

export async function setToken(key: 'access' | 'refresh', value: string) {
  if (isWeb) {
    // SECURITY: Web uses localStorage as a fallback. For production web builds,
    // consider migrating to an httpOnly cookie flow on the backend instead.
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getToken(key: 'access' | 'refresh') {
  if (isWeb) {
    return localStorage.getItem(key) || null;
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function deleteToken(key: 'access' | 'refresh') {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
