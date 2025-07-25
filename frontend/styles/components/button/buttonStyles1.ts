// Boton Violeta con letra blanca

import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const buttonStyles1 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Borders.soft,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.violet4,
  },
  texto: {
    color: 'white',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
