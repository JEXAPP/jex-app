import { StyleSheet } from 'react-native';
import { Shapes } from '../../themes/shapes';

export const inputStyles = StyleSheet.create({
  input: {
    fontFamily: 'interBold',
    backgroundColor: '#FFFFFF',
    padding: 17,
    width: 350,
    alignSelf: 'center',
    marginBottom: 15,
    ...Shapes.soft,
  },});
