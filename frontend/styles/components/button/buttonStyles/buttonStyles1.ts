// Boton Violeta con letra blanca

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles1 = StyleSheet.create({
  boton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Borders.soft,
    marginBottom: 10,
    width: 350,
    height: 50,
    alignSelf: 'center',
    backgroundColor: Colors.violet4,
  },
  texto: {
    color: 'white',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
