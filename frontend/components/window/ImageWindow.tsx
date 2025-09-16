import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { imageWindowStyles as styles } from '@/styles/components/window/imageWindowStyles1';

type Props = {
  visible: boolean;
  title: string;                  // Texto de arriba
  buttonText?: string;            // Texto del botón
  onClose: () => void;            // Cerrar modal
  imageSource?: ImageSourcePropType; // Si pasás una imagen
  subtitle?: string;
  texto?: string;              // 👈 Texto opcional debajo de la imagen    // O podés pasar un nodo (p.ej. <QRCode .../>)
  children?: React.ReactNode
};

export default function ImageWindow({
  visible,
  title,
  buttonText = 'Cerrar',
  onClose,
  imageSource,
  subtitle,
  texto,
  children
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose} // Android back
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

            <View style={styles.mediaBox}>
              {children
                ? children
                : imageSource && (
                    <Image
                      source={imageSource}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  )}
            </View>

          {/* 👇 Texto opcional debajo de la imagen */}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {texto ? <Text style={styles.text}>{texto}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
