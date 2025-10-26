import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const suggestionsStyles2 = StyleSheet.create({
  contenedor: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 99999,
  elevation: 100,
  backgroundColor: 'white',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  marginTop: 6,
  overflow: 'visible', // 👈 importante: si se superpone, que no corte el área táctil
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
