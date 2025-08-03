import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

export const turnoInputStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: 'interMedium',
    color: Colors.gray3,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  numericInput: {
    borderWidth: 1,
    borderColor: Colors.gray2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    width: '90%',
  },
  pagoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray2,
    padding: 11,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
});