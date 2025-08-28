// Botón ELIMINAR rojo

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles6 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Borders.soft,
    width: 150,
    alignSelf: 'center',
    backgroundColor: Colors.red,
  },
  texto: {
    color: Colors.gray1,
    fontFamily: 'interSemiBold',
    fontSize: 16,
  },
});