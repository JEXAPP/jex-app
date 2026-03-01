import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const buttonWithIconStyles3 = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor:Colors.violet4,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: 350,
  },
  icono: {
  },
  texto: {
    fontFamily: 'interSemiBold',
    fontSize: 18,
    color: Colors.violet4,
    flex: 1,
  },
});