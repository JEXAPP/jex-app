import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const showVacancyStyles1 = StyleSheet.create({
  card: {
    width: 140,
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    alignItems: 'flex-start',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: Borders.soft,
    marginTop: 3,
    marginBottom: 5,
    alignSelf: 'center'
  },
  textContainer: {
    padding: 4,
    flex: 1,
    minHeight: 92,
  },
  role: {
    fontSize: 16,
    fontFamily: 'interBold',
    marginVertical: 5,
    color: Colors.violet5,
    lineHeight: 20,
  },
  date: {
    fontSize: 13,
    color: Colors.gray3,
    fontFamily: 'interItalic'
  },
  payment: {
    fontSize: 14,
    color: Colors.violet3,
    fontFamily: 'interSemiBold'
  },
  icon: {
    marginLeft: 8,
  }
});
