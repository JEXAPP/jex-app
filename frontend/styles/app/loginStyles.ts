import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    marginBottom: 50,
    marginTop: 10,
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
  passwordRow: {
    marginTop: 15,
    marginBottom: 10
  }
});
