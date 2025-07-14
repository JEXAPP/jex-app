import React from 'react';
import { Modal, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ModalConTextoProps {
  visible: boolean;
  title: string;
  buttonText: string;
  message: string;
  icono?: React.ReactNode;
  onClose: () => void;
  styles: {
    overlay: StyleProp<ViewStyle>;
    modal: StyleProp<ViewStyle>;
    row: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    message: StyleProp<TextStyle>;
    button: StyleProp<ViewStyle>;
    buttonText: StyleProp<TextStyle>;
  };
}

export const ModalConTexto = ({ visible, message, onClose, styles, title, buttonText, icono=null }: ModalConTextoProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>       
        <View style={styles.modal}>
          <View style={styles.row}>
            {icono}
            <Text style={styles.title}>{title}</Text>
            </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

