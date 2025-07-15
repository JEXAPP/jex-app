import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const confirmarCorreoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.gray1,
    justifyContent: 'center',
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop:50,
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 370,
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 15,
  }
});