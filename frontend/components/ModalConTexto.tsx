import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Modal, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../themes/colors';

interface ModalConTextoProps {
  visible: boolean;
  message: string;
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

export const ModalConTexto = ({ visible, message, onClose, styles }: ModalConTextoProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>       
        <View style={styles.modal}>
          <View style={styles.row}>
            <MaterialIcons name="error" size={24} color={ Colors.violet5 } />
            <Text style={styles.title}>Error</Text>
            </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

