import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';
import { Borders } from '@/themes/borders';

export const selectorFechaStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 6,
    color: Colors.violet4,
    fontSize: 16,
    fontFamily: 'interBold',
  },
  selector: {
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
  },
  textoSelector: {
    color: Colors.violet5,
    fontSize: 16,
    fontFamily: 'interSemiBold',
  },
});