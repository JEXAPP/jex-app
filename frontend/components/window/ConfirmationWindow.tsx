import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;      
  title?: string;
  confirming?: boolean;
};

export const ConfirmationModal: React.FC<Props> = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Confirmar asistencia',
  confirming = false,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel} accessibilityLabel="Cancelar">
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>Tocá para confirmar</Text>

          <TouchableOpacity
            style={[styles.confirmBtn, confirming && { opacity: 0.7 }]}
            onPress={onConfirm}
            disabled={confirming}
            accessibilityLabel="Confirmar asistencia"
          >
            <Ionicons name="checkmark" size={56} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const CARD_W = 320;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222', textAlign: 'center' },
  sub: { marginTop: 4, marginBottom: 18, fontSize: 13, color: '#666', textAlign: 'center' },
  confirmBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.violet4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
