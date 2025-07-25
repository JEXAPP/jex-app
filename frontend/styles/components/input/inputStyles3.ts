import { StyleSheet } from 'react-native';
import { Borders } from '../../../themes/borders';
import { Colors } from '@/themes/colors';

export const inputStyles3 = StyleSheet.create({
  input: {
    fontFamily: 'interMedium',
    backgroundColor: Colors.white,
    padding: 17,
    width: 300,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: Borders.soft,
    fontSize: 16
  }});