// Botón "desactivado" gris

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles8 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Borders.soft,
    width: 150,
    alignSelf: 'center',
    backgroundColor: Colors.gray3,
  },
  texto: {
    color: Colors.gray1,
    fontFamily: 'interSemiBold',
    fontSize: 16,
  },
});