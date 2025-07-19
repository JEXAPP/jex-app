// Botón "desactivado" gris

import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';
import { Borders } from '@/themes/borders';

export const buttonStyles4 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Borders.soft,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.gray3,
  },
  texto: {
    color: Colors.gray1,
    fontFamily: 'interSemiBold',
    fontSize: 16,
  },
});