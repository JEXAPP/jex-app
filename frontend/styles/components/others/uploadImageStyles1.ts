import { Colors } from '@/themes/colors';
import { StyleSheet } from 'react-native';

export const uploadImageStyles1 = StyleSheet.create({
  icon: {
    marginRight: 6,
    color: Colors.violet5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addText: {
    fontSize: 16,
    color: Colors.gray3,
    fontWeight: '600',
  },
});
