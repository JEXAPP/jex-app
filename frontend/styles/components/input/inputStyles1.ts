import { StyleSheet } from 'react-native';
import { Borders } from '../../../themes/borders';
import { Colors } from '@/themes/colors';

export const inputStyles1 = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    width: 350,
    alignSelf: 'center',
    marginBottom: 15,
    paddingHorizontal: 15, // espacio entre borde e icono/input
  },
  input: {
    flex: 1,
    fontFamily: 'interMedium',
    fontSize: 16,
    paddingVertical: 17,   // altura del input
    color: Colors.black,   // color de texto
  },
});
