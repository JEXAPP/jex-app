// Boton que es solo un texto violeta apretable

import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const botonStyles5 = StyleSheet.create({
  boton: {
    alignItems: 'flex-end',
    marginTop: 5,
    borderRadius: Borders.soft,
    marginBottom: 15,
    width: 350,
    alignSelf: 'center',
  },
  texto: {
    color: Colors.gray3,
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
