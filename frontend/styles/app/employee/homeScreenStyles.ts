import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const homeScreenEmployeeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.gray1,
  },
  adsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 34,
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
  vacancySectionContainer: {
    marginVertical: 12,
  },
  vacancySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vacancyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacancyTitle: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  vacancyArrow: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginLeft: 10,
  },
  vacancyCardWrapper: {
    marginRight: 15,
  },
});
