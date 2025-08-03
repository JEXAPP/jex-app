import React from 'react';
import { Modal, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ClickWindowProps {
  visible: boolean;
  title: string;
  buttonText: string;
  message: string;
  icono?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void; 
  cancelButtonText?: string;
  onCancel?: () => void;
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

export const ClickWindow = ({
  visible,
  title,
  message,
  buttonText,
  icono = null,
  onClose,
  onConfirm,
  cancelButtonText,
  onCancel,
  styles,
}: ClickWindowProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.row}>
             {icono}
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <Text style={styles.message}>{message}</Text>

          <View style={styles.row}>
            {cancelButtonText && (
              <TouchableOpacity
                style={styles.button}
                onPress={onCancel ?? onClose}
              >
                <Text style={styles.buttonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={onConfirm ?? onClose}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

  );
};

