import React from 'react';
import {
  Modal,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ClickWindowProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
  onConfirm?: () => void; // Nuevo botón opcional
  icono?: React.ReactNode;
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

export const ClickCancelWindow = ({
  visible,
  title,
  message,
  buttonText,
  onClose,
  onConfirm,
  icono = null,
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

          {/* Si hay onConfirm, mostramos los dos botones */}
          {onConfirm ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
                marginTop: 16,
              }}
            >
              <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onConfirm}>
                <Text style={styles.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Si no hay onConfirm, botón único
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
