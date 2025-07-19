import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const registerTypeUserStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: Colors.gray1,
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
    marginLeft: 35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 95,
  },
  opcionesContainer: {
    gap: 8,
    marginBottom: 320
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
