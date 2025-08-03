import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const buttonStyles6 = StyleSheet.create({
  boton: {
    backgroundColor: Colors.gray3,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  texto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});