import Constants from 'expo-constants';

export const config = {
  apiBaseUrl: Constants.expoConfig?.extra?.API_BASE_URL,
  googleClientIdAndroid: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_ANDROID,
  // googleClientIdIos: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_IOS ,
  // googleApiKey: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_IOS,
  googleExpoClientId: Constants.expoConfig?.extra?.GOOGLE_EXPO_CLIENT_ID ,
};