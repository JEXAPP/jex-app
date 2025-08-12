import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const buttonWithIconStyles2 = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white, 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Borders.soft,
    marginHorizontal: 16,
    marginTop: 12,
    width: 350,
    alignSelf: 'center',
  },
  icono: {
    marginRight: 15,
    color: Colors.gray3, 
  },
  texto: {
    fontSize: 17,
    fontFamily: 'interMedium',
    color: Colors.gray3,
    flex: 1,
  },
});
