// Input para poner códigos de confirmación
import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const inputStyles2 = StyleSheet.create({
  input: {
    width: 48,
    height: 58,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    color: Colors.violet5,
    backgroundColor: Colors.white,
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  animacionError: {
    transform: [{ translateX: -5 }],
  },
});
