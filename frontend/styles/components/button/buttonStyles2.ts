// Boton blanco con borde y letra violeta

import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const buttonStyles2 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Borders.soft,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.violet4,
  },
  texto: {
    color: Colors.violet4,
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
