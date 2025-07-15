
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const validarCodigoStyles = StyleSheet.create({
  container:{
    flex: 1
  },
  title: {
    fontSize: 34,
    fontFamily: 'interBold',
    color: Colors.violet5,
    textAlign: 'left',
    flexShrink: 1,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginLeft: 25
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:102,
  },
  texto: { 
    fontSize: 20, 
    fontFamily: 'interBold', 
    marginBottom: 20, 
    color: Colors.violet4,
    alignSelf: 'flex-start',
    paddingLeft: 10
  },
  keyboardAvoidingView:{
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    padding: 20
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 48,
    height: 58,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    color: Colors.violet5,
    backgroundColor: Colors.white,
  },
});
