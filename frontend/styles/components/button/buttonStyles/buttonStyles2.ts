// Boton blanco con borde y letra violeta

import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const buttonStyles2 = StyleSheet.create({
  boton: {
    justifyContent: 'center',
    height: 50,
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
