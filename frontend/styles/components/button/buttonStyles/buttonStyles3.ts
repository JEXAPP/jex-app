// Boton que simula un Input que apretas

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles3 = StyleSheet.create({
  boton: {
    justifyContent: 'center',
    height: 50,
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