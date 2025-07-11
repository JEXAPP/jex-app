import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const botonStyles2 = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.violet5,
  },
  texto: {
    color: Colors.violet5,
    fontFamily: 'interBold',
    fontSize: 16,
  },
});
