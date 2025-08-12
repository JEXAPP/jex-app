import React from 'react';
import { Modal, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ClickWindowProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;                 
  icono?: React.ReactNode;            
  onClose: () => void;                
  onCancelPress?: () => void;         
  cancelButtonText?: string;          
  styles: {
    overlay: StyleProp<ViewStyle>;
    modalWrapper: StyleProp<ViewStyle>; 
    iconBadge: StyleProp<ViewStyle>;    
    modal: StyleProp<ViewStyle>;
    row: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    message: StyleProp<TextStyle>;
    button: StyleProp<ViewStyle>;       
    buttonText: StyleProp<TextStyle>;
    button2?: StyleProp<ViewStyle>;     
    buttonText2?: StyleProp<TextStyle>; 
  };
}

export const ClickWindow: React.FC<ClickWindowProps> = ({
  visible,
  title,
  message,
  buttonText,
  icono = null,
  onClose,
  onCancelPress,            
  cancelButtonText = 'Cancelar',
  styles,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <View>
              <Text style={styles.title}>{title}</Text>
            </View>

            <Text style={styles.message}>{message}</Text>

            <View style={styles.row}>
              {onCancelPress ? (
                <TouchableOpacity
                  style={styles.button2 ?? styles.button}
                  onPress={onCancelPress}
                  accessibilityRole="button"
                  accessibilityLabel={cancelButtonText}
                >
                  <Text style={styles.buttonText2 ?? styles.buttonText}>
                    {cancelButtonText}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={buttonText}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {icono ? <View style={styles.iconBadge}>{icono}</View> : null}

        </View>
      </View>
    </Modal>
  );
};
