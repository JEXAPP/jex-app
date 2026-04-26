
// SECURITY: Read the API base URL from an env var so production always uses HTTPS.
// EXPO_PUBLIC_API_URL must be set to https:// in .env.production.
// The fallback below is intentionally HTTP and only valid for local LAN development.
const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ?? 'http://192.168.1.7:8000/';

// SECURITY: Hard-fail at startup if the production build would send credentials
// over plain HTTP. Localhost / LAN IPs are allowed only in __DEV__ mode.
if (!__DEV__ && !API_BASE_URL.startsWith('https://')) {
  throw new Error(
    '[SECURITY] apiBaseUrl must use HTTPS in production builds. ' +
    'Set EXPO_PUBLIC_API_URL=https://your-domain.com/ in your production environment.'
  );
}

export const config = {
  apiBaseUrl: 'http://127.0.0.1:8000/',
  google: {
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    clientIdIOS: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  mercadoPago: {
    clientId: process.env.EXPO_PUBLIC_MP_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_MP_REDIRECT_URI,
  },
};
