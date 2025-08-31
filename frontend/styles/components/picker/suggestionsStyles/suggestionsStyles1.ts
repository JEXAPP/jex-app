import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const suggestionsStyles1 = StyleSheet.create({
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
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray2,
  },
  texto: {
    fontSize: 15,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
});