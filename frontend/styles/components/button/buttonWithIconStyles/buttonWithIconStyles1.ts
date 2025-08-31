import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const buttonWithIconStyles1 = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.violet4,
    borderWidth: 2,
    borderRadius: Borders.soft,
    height: 50,
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 6,
    width: 350,
    alignSelf: 'center',
    backgroundColor: Colors.white
  },
  icono: {
    width: 23,
    height: 23,
    marginRight: 20,
  },
  texto: {
    fontFamily: 'interBold',
    fontSize: 16,
    color: Colors.violet4,
    marginRight: 20,
    marginLeft: 10
  },
});
