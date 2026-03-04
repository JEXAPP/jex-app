
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  google: {
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    clientIdIOS: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  mercadoPago: {
    clientId: process.env.EXPO_PUBLIC_MP_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_MP_REDIRECT_URI
  }
};
