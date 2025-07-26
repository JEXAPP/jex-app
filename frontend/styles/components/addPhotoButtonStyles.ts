import { StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';
import { AddPhotoButton } from '../../components/AddPhotoButton';

export const addPhotoButtonStyles = StyleSheet.create({ 
  icon: {
    marginRight: 6,
    color: Colors.violet5,
},
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
},
  addText: {
    fontSize: 16,
    color: Colors.violet5,
    fontWeight: '600',
},
})