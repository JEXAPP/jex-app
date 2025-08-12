import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const dropdownStyles1 = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0 as any,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  item: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  itemSelected: {
    backgroundColor: Colors.white,
  },
  itemText: {
    color: '#333',
    fontWeight: '500',
  },
  itemTextSelected: {
    color: Colors.violet1,
    fontWeight: '700',
  },
});
