import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useEffect } from 'react';
import { Modal, StyleProp,View, ViewStyle } from 'react-native';
import { Colors } from '../themes/colors';

interface ModalTemporalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  duration: number;
  styles: {
    overlay: StyleProp<ViewStyle>;
    modal: StyleProp<ViewStyle>;
    row: StyleProp<ViewStyle>;
  };
}

export const ModalTemporal = ({ visible, onClose, styles, duration }: ModalTemporalProps) => {

    useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer); 
    }
  }, [visible, duration, onClose]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.row}>
            <FontAwesome5 name="check-circle" size={40} color={Colors.violet5} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

