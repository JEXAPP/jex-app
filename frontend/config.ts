import Constants from 'expo-constants';

export const config = {
  apiBaseUrl: Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:8000',
  googleClientIdAndroid: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_ANDROID || '242946374654-htkjh0r5mbaa0ds518mqe90k4og3lkh6.apps.googleusercontent.com',
  googleClientIdIos: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_IOS || '242946374654-q9df2f5rrdgmdv825b2clmgfr74pqq87.apps.googleusercontent.com',
  googleApiKey: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_IOS || 'AIzaSyCBfqlHMnCW0kIBQeruVZbdGUlxyYeHlDQ'
};

