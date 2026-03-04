import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const suggestionsStyles2 = StyleSheet.create({
contenedor: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderRadius: 10,
  marginTop: 6,
  zIndex: 9999,
  elevation: 9999,
  overflow: 'visible',
},
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  texto: {
    fontSize: 15,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
});
