import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const placeSuggestionsStyles1 = StyleSheet.create({
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