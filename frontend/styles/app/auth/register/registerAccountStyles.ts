import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registerAccountStyles = StyleSheet.create({
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
    marginBottom: 10,
    marginTop: 65,
  },
  opcionesContainer: {
    marginBottom: 140,
    alignItems: 'center',
    gap:20
  },
  texto:{
    marginTop: 10,
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
  },
  step: {
    paddingHorizontal: 20
  },
  passwordBar:{
    marginLeft: 40,
    marginBottom: 20
  }
});
