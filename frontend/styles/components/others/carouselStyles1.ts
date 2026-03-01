import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const carouselStyles1 = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 160,
    borderRadius: Borders.soft,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray2,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.violet4,
    width: 9,
    borderRadius: 9,
    height: 9,
  },
});
