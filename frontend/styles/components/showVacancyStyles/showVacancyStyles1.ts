import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const showVacancyStyles1 = StyleSheet.create({
  card: {
    width: 160,
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    alignItems: 'flex-start',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: Borders.soft,
    marginTop: 3,
    marginBottom: 4,
    alignSelf: 'center'
  },
  textContainer: {
    padding: 4,
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: Colors.gray3,
    fontFamily: 'interMedium'
  },
  role: {
    fontSize: 16,
    fontFamily: 'interBold',
    marginVertical: 2,
    color: Colors.violet5,
  },
  payment: {
    fontSize: 15,
    color: Colors.violet3,
    fontFamily: 'interSemiBold'
  },
  icon: {
    marginLeft: 8,
  }
});
