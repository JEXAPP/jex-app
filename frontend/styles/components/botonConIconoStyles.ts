import { StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors';
import { Borders } from '@/themes/borders';

export const botonConIconoStyles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.violet5,
    borderWidth: 2,
    borderRadius: Borders.soft,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    marginRight: 10,
  },
  texto: {
    fontFamily: 'interSemiBold',
    fontSize: 16,
    color: Colors.violet5,
  },
});
