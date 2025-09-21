// Boton Violeta con letra blanca chiquito

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles6 = StyleSheet.create({
  boton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Borders.soft,
    width: "100%",
    height: 50,
    backgroundColor: Colors.violet4,
  },
  texto: {
    color: 'white',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
