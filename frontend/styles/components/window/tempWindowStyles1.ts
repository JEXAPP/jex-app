import { StyleSheet } from 'react-native';
import { Borders } from '@/themes/borders';
import { Colors } from '@/themes/colors';

export const tempWindowStyles1 = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.violet4,
    padding: 24,
    borderRadius: Borders.soft,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  }
});
