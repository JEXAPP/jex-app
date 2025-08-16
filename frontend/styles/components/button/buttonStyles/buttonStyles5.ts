// Boton que es solo un texto apretable

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles5 = StyleSheet.create({
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
    fontFamily: 'interSemiBold',
    fontSize: 16,
  },
});
