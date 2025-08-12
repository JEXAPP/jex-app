import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const carouselStyles1 = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 180,
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
    width: 10,
    borderRadius: 5,
    height: 10,
  },
});
