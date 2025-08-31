// Botón "desactivado" gris

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles4 = StyleSheet.create({
  boton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
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