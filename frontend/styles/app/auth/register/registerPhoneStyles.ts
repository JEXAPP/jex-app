import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const registerPhoneStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  step:{
    paddingHorizontal: 20,
    gap: 10
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
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 65,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    gap: 25
  },
  opcionesContainer: {
    gap: 2,
    marginBottom: 130
  },
  texto:{
    fontFamily: 'interBold',
    fontSize: 18,
    color: Colors.violet4,
    textAlign: 'left',
    marginBottom: 20,
  }
});
