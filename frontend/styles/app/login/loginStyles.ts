// styles/loginStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '../../../themes/colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    marginBottom: 50,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'titulos',
    fontSize: 65,
    color: Colors.violet4,
    textAlign: 'center', 
  },
  image: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -40,
    right: -40,
    resizeMode: 'contain',
  },
});
