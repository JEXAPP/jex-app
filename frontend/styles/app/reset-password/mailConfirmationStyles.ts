import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const mailConfirmationStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.gray1,
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop:60,
  },
  inputContainer: {
    marginBottom: 335,
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 20,
    color: Colors.violet5,
    textAlign: 'left',
    marginBottom: 15,
  }
});