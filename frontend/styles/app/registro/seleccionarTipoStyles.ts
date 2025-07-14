import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const seleccionarTipoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: Colors.gray1,
  },
  title: {
    fontSize: 38,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 20,
    marginLeft: 35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 100,
  },
  opcionesContainer: {
    gap: 8,
    marginBottom: 315
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginLeft: 22,
    marginBottom: 10
  },
});
