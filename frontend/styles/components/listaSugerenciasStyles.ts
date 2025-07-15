import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';
import { Borders } from '@/themes/borders';

export const listaSugerenciasStyles = StyleSheet.create({
  contenedor: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.gray2,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    maxHeight: 150,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray2,
  },
  texto: {
    fontSize: 16,
    fontFamily: 'interSemiBold',
    color: Colors.gray3,
  },
});