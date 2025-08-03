// screens/HomeScreenEmployee/homeScreenEmployee.styles.ts

import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const homeScreenEmployeeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,          // Para ScrollView con contentContainerStyle
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor:Colors.gray1,
  },
  adsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  jexBanner: {
    width: 120,
    height: 150,
    borderRadius: 12,
  },
  loadingWrapper: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
    color: Colors.red,
    fontWeight: '500',
  },
});
