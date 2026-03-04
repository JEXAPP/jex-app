import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const changePasswordThreeStyles = StyleSheet.create({
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
    marginLeft: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 65,
  },
  texto: {
    fontSize: 18,
    fontFamily: 'interBold',
    color: Colors.violet4,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 10,
    marginBottom: 180,
    gap: 20,
    alignItems: 'center',
  },
  passwordBar: {
    width: '100%',
    paddingHorizontal: 20,
  },
});
