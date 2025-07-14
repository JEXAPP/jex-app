// Input normal para ingresar texto

import { StyleSheet } from 'react-native';
import { Borders } from '../../../themes/borders';
import { Colors } from '@/themes/colors';

export const inputStyles1 = StyleSheet.create({
  input: {
    fontFamily: 'interBold',
    backgroundColor: Colors.white,
    padding: 17,
    width: 350,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: Borders.soft,
    fontSize: 16
  }});
