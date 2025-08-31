import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const showVacancyStyles2 = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    borderRadius: Borders.soft,
    backgroundColor: Colors.white,
    marginVertical: 6,
  },
  image: {
    marginVertical: 10,
    marginLeft: 10,
    width: 80,
    height: 80,
    borderRadius: Borders.soft,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  date: {
    fontSize: 13,
    fontFamily: 'interMedium',
    color: Colors.gray2,
  },
  role: {
    fontSize: 16.5,
    fontFamily: 'interBold',
    marginVertical: 6,
    color: Colors.black
  },
  payment: {
    fontSize: 14,
    fontFamily: 'interBold',
    color: Colors.violet4,
  },
  icon: {
    marginLeft: 8,
    marginRight: 15,
  },
});
