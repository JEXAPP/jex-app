// styles/app/registro/validarCodigoStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const validarCodigoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    backgroundColor: Colors.gray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 75,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 20,
    marginLeft: 10,
  },
  title: {
    fontSize: 38,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'left',
    flexShrink: 1,
  },
  texto: {
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20,
  },
  opcionesContainer: {
    gap: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontSize: 20,
    borderWidth: 1,
    borderColor: Colors.violet5,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
   boton: {
    backgroundColor: Colors.violet5,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',

  },
  botonTexto: {
    color: '#fff',
    fontFamily: 'interBold',
    fontSize: 18,
  },
});
