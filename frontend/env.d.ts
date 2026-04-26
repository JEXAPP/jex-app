declare module '@env' {
  export const API_BASE_URL: string;
  export const GOOGLE_CLIENT_ID_ANDROID: string;
  export const GOOGLE_CLIENT_ID_IOS: string;
  export const GOOGLE_CLIENT_ID_WEB: string;
  export const GOOGLE_API_KEY: string;
}

// __DEV__ is injected by Metro/webpack for all platforms including web.
// Declared here so TypeScript resolves it without relying solely on @types/react-native.
declare const __DEV__: boolean;
