import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const mailConfirmationStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 65

  },
  inputContainer: {
    marginBottom: 310,
    paddingHorizontal: 20
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 10
  }
});