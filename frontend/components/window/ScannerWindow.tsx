import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

interface ScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (value: string) => void;   
  locked?: boolean;                     // si true, ignora lecturas (confirmación activa)
  title?: string;
  showTorchToggle?: boolean;
  scanDebounceMs?: number;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  visible,
  onClose,
  onScanned,
  locked = false,
  title = 'Escanear QR',
  showTorchToggle = true,
  scanDebounceMs = 1200,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<'on' | 'off'>('off');

  const lastValueRef = useRef<string | null>(null);
  const lastTimeRef = useRef<number>(0);

  // pedir permisos al abrir
  useEffect(() => {
    (async () => {
      if (!visible) return;
      if (!permission?.granted) {
        const res = await requestPermission();
        if (!res.granted) {
          if (!res.canAskAgain) {
            Alert.alert(
              'Permiso de cámara requerido',
              'Habilitá la cámara desde Ajustes para escanear.',
              [
                { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
                { text: 'Cerrar', style: 'cancel', onPress: onClose },
              ]
            );
          } else {
            onClose();
          }
        }
      }
    })();
    if (!visible) {
      setTorch('off');
      lastValueRef.current = null;
      lastTimeRef.current = 0;
    }
  }, [visible, permission?.granted]);

  const handleBarcode = useCallback(
    (result: BarcodeScanningResult) => {
      const value = result?.data?.trim();
      if (!value || locked) return;

      const now = Date.now();
      if (value === lastValueRef.current && now - lastTimeRef.current < scanDebounceMs) return;

      lastValueRef.current = value;
      lastTimeRef.current = now;

      // NO cerramos el modal: queda detrás para seguir escaneando
      onScanned(value);
    },
    [onScanned, scanDebounceMs, locked]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.headerRight}>
              {showTorchToggle ? (
                <TouchableOpacity
                  onPress={() => setTorch(prev => (prev === 'off' ? 'on' : 'off'))}
                  accessibilityRole="button"
                  style={styles.iconBtn}
                >
                  <Ionicons name={torch === 'on' ? 'flashlight' : 'flashlight-outline'} size={20} color={Colors.white} />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={onClose} accessibilityRole="button" style={[styles.iconBtn, { marginLeft: 8 }]}>
                <Ionicons name="close" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cámara acotada */}
          <View style={styles.cameraWrap}>
            {permission?.granted ? (
              <CameraView
                facing="back"
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={handleBarcode}
                enableTorch={torch === 'on'}
              />
            ) : (
              <View style={styles.permFallback}>
                <Text style={styles.permText}>Necesitás habilitar la cámara para escanear.</Text>
              </View>
            )}

            {/* Marco guía */}
            <View pointerEvents="none" style={styles.frame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
          </View>

          <Text style={styles.helper}>Alineá el código dentro del marco</Text>
        </View>
      </View>
    </Modal>
  );
};

const CARD_WIDTH = 320;
const CARD_HEIGHT = 420;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  title: { 
    color: Colors.violet4, 
    fontSize: 24, 
    fontFamily: 'titulos',
    marginLeft: 10 
  },
  iconBtn: {
    backgroundColor: Colors.violet4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cameraWrap: {
    marginHorizontal: 14,
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
    height: 280,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  camera: { 
    position: 'absolute', 
    inset: 0 
  },
  frame: { 
    position: 'absolute', 
    inset: 0 
  },
  cornerTL: {
    position: 'absolute', 
    top: 12, 
    left: 12, 
    width: 28, 
    height: 28,
    borderTopWidth: 3, 
    borderLeftWidth: 3, 
    borderColor: Colors.white,
    borderTopLeftRadius: 8
  },
  cornerTR: {
    position: 'absolute', 
    top: 12, 
    right: 12, 
    width: 28, 
    height: 28,
    borderTopWidth: 3, 
    borderRightWidth: 3, 
    borderColor: Colors.white,
    borderTopEndRadius: 8
  },
  cornerBL: {
    position: 'absolute', 
    bottom: 12, 
    left: 12, 
    width: 28, 
    height: 28,
    borderBottomWidth: 3, 
    borderLeftWidth: 3, 
    borderColor: Colors.white,
    borderBottomLeftRadius: 8
  },
  cornerBR: {
    position: 'absolute', 
    bottom: 12, 
    right: 12, 
    width: 28, 
    height: 28,
    borderBottomWidth: 3, 
    borderRightWidth: 3, 
    borderColor: Colors.white,
    borderBottomEndRadius: 8
  },
  helper: {
    color: Colors.gray3,
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 25,
    fontFamily: 'interMediumItalic',
  },
  permFallback: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  permText: { 
    color: Colors.violet3, 
    opacity: 0.9, 
    padding: 16, 
    textAlign: 'center' 
  },
});
