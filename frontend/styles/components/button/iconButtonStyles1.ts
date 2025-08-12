import { StyleSheet } from 'react-native';
import { Borders } from '@/themes/borders';

export const iconButtonStyles1 = StyleSheet.create({
  button: {
    borderRadius: Borders.rounded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'interBold',
    alignSelf: 'center'
  }
});