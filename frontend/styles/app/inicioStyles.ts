
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const inicioStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.violet3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 80,
    fontFamily: 'projectName',
    color: 'white',
  },
});