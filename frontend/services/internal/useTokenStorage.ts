import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export async function setToken(key: 'access' | 'refresh', value: string) {
  if (isWeb) {
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
