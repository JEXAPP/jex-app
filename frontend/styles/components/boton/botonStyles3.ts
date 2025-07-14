// Boton que simula un Input que apretas

import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const botonStyles3 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'baseline',
    borderRadius: Borders.soft,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  texto: {
    color: Colors.gray3,
    fontFamily: 'interSemiBold',
    fontSize: 16,
    marginLeft: 27
  },
});