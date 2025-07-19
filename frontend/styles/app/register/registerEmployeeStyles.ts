import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const registerEmployeeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
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
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 100
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20
  },
});
