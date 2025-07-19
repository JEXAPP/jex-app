import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const newPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
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
    marginBottom: 30,
    marginTop:95,
  },
  content:{
    marginBottom: 270
  },
  texto: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.violet5,
    marginBottom: 20,
  },
});
