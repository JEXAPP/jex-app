import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

export const orderButtonStyles1 = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    width: 40,      
    height: 40,
    backgroundColor: Colors.violet4,
    borderRadius: Borders.rounded,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: 'interSemiBold'
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: Borders.soft,
    borderWidth: 1,
    borderColor: Colors.gray1,
    width: 180,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: Colors.gray3,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.gray3,
  },
});
