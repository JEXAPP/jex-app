import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addPhotoButtonStyles as styles} from '@/styles/components/addPhotoButtonStyles';

interface AddPhotoButtonProps {
  hasImage: boolean;
  onPress: () => void;
}

export const AddPhotoButton = ({ hasImage, onPress }: AddPhotoButtonProps) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Ionicons
        name={hasImage ? 'trash' : 'camera'}
        size={20}
        style={styles.icon}
      />
      <Text style={styles.addText}>{hasImage ? 'Eliminar' : 'Agregar'}</Text>
    </TouchableOpacity>
  );
};