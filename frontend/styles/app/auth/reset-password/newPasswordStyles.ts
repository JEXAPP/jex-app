import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const newPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 65,
  },
  content:{
    marginBottom: 210,
    alignItems: 'center',
    gap: 15
  },
  texto: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  step:{
    paddingHorizontal: 20
  },
  passwordBar:{
    marginLeft: 40
  }
});
