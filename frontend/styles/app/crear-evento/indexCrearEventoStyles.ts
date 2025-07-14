import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const indexCrearEventoStyles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.gray1
  },
  texto: {
    fontSize: 15,
    color: Colors.gray3,
    textAlign: 'left',
    flexShrink: 1,
    fontFamily: 'interSemiBold',
    marginTop: 10
  },
})