import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const registerEmployerStyles = StyleSheet.create({
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
    marginTop: 60,
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 330
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 10
  },
  step: {
    paddingHorizontal: 20
  }
});
