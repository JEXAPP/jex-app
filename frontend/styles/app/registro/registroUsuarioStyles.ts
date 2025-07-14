import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registroUsuarioStyles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
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
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 75,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputArea: {
    marginRight: 10,
  },
  inputTelefono: {
    flex: 1.3,
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
    marginBottom: 110
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20
  }
});
