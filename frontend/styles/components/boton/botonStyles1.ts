import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const botonStyles1 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.violet5,
  },
  texto: {
    color: 'white',
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
