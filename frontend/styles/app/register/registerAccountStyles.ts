import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registerAccountStyles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontFamily: 'titulos',
    color: Colors.violet4,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 75,
  },
  seguridadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  barrita: {
    height: 6,
    width: 60,
    borderRadius: 4,
    marginLeft: 10,
  },
  textoSeguridad: {
    fontSize: 14,
    fontFamily: 'interRegular',
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 185
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20
  }
});
