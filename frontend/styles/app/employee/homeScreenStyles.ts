import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const homeScreenEmployeeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.gray1,
  },
  title: {
    fontSize: 50,
    fontFamily: 'titulos',
    color: Colors.violet4,
    marginBottom: 5
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 110,
    marginBottom: 5
  },
  adsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 25,
    gap: 20
  },
  jexBanner: {
    width: 100,
    height: 130,
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
