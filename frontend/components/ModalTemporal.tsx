import React, { useEffect } from 'react';
import { Modal, StyleProp,View, ViewStyle } from 'react-native';


interface ModalTemporalProps {
  visible: boolean;
  onClose: () => void;
  duration: number;
  icono: React.ReactNode;
  styles: {
    overlay: StyleProp<ViewStyle>;
    modal: StyleProp<ViewStyle>;
  };
}

export const ModalTemporal = ({ visible, onClose, styles, duration, icono }: ModalTemporalProps) => {

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
            {icono}
        </View>
      </View>
    </Modal>
  );
};

