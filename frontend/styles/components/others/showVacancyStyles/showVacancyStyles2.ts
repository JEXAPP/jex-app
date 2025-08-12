import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const showVacancyStyles2 = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Borders.soft,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.gray2,
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
    color: Colors.black,
  },
  payment: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.violet4,
  },
  icon: {
    marginLeft: 8,
  },
});
