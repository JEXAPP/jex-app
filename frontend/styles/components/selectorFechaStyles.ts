import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';
import { Borders } from '@/themes/borders';

export const selectorFechaStyles = StyleSheet.create({
  container: {
    marginVertical: 0
  },
  selector: {
    padding: 17,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft
  },
  textoSelector: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'interBold',
  },
});