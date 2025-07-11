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
    fontWeight: '800',
    color: Colors.violet5,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 100,
  },
  opcionesContainer: {
    gap: 16,
    marginBottom: 30,
  },
});
