import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const registroEmpleadoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
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
    marginLeft: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 75,
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 25
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 20
  },
});
