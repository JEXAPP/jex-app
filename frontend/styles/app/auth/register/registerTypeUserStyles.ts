import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const registerTypeUserStyles = StyleSheet.create({
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
    marginBottom: 10,
    marginTop: 65,
  },
  opcionesContainer: {
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 260,
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 15
  },
});
