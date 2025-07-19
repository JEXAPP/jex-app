import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registerPhoneStyles = StyleSheet.create({
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
  opcionesContainer: {
    gap: 2,
    marginBottom: 195
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 10
  }
});
