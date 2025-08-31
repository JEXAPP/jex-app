import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const searchVacancyStyles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    alignItems: 'center',
    marginTop: 12
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    marginTop: 15,
    overflow: 'visible',
    zIndex: 0,
  },
  results:{
    marginTop: 20
  },
  noVancancyCard: {
    height: 500,
    width: 350,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  noVancancyTitle: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    textAlign: 'center',
  },
  noVancancyImage: {
    width: 250,
    height: 250,
    marginBottom: 55,
    marginTop: 45,
  },
  noVancancySubtitle: {
    fontSize: 14,
    fontFamily: 'interItalic',
    color: Colors.gray3,
    textAlign: 'center',
  },
});
