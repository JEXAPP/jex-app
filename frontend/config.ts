
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  google: {
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    clientIdIOS: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  }
};
