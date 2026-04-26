import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Single abstraction layer for all persistent secure key-value storage.
// On native (iOS/Android) it uses expo-secure-store (Keychain / Keystore).
// On web it falls back to localStorage because expo-secure-store has no web implementation.
// All callers import from here — never import expo-secure-store directly in hooks.

export async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function secureDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
