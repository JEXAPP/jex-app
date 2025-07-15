import Constants from 'expo-constants';

export const config = {
  apiBaseUrl: Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:8000',
  googleClientId: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID || 'your-google-client-id',
};

