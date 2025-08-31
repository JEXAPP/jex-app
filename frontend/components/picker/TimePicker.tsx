import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/themes/colors';

interface TimePickerProps {
  time: string | null;
  setTime: (time: string) => void;
  label?: string;
  styles: {
    selector: StyleProp<ViewStyle>;
    timeText: StyleProp<TextStyle>;
    modalOverlay: StyleProp<ViewStyle>;
    modalContent: StyleProp<ViewStyle>;
    modalTitle: StyleProp<TextStyle>;
    pickerWrapper: StyleProp<ViewStyle>;
    pickerInner: StyleProp<ViewStyle>;
    scrollPicker: StyleProp<ViewStyle>;
    pickerItem: StyleProp<TextStyle>;
    selectedItem: StyleProp<TextStyle>;
    divider: StyleProp<TextStyle>;
    fadeTop: StyleProp<ViewStyle>;
    fadeBottom: StyleProp<ViewStyle>;
    // nuevos
    actionsRow: StyleProp<ViewStyle>;
    cancelButton: StyleProp<ViewStyle>;
    cancelText: StyleProp<TextStyle>;
    confirmButton: StyleProp<ViewStyle>;
    confirmText: StyleProp<TextStyle>;
  };
}

const TimePicker: React.FC<TimePickerProps> = ({ time, setTime, label = 'Seleccioná una hora', styles }) => {
  const itemHeight = 40;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(time ? parseInt(time.split(':')[0]) : 0);
  const [selectedMinute, setSelectedMinute] = useState<number>(time ? parseInt(time.split(':')[1]) : 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  const parseTime = (t: string | null): { h: number; m: number } => {
    if (!t) return { h: 0, m: 0 };
    const [h, m] = t.split(':').map(n => parseInt(n, 10));
    return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
    };

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({ y: selectedHour * itemHeight, animated: false });
        minuteScrollRef.current?.scrollTo({ y: selectedMinute * itemHeight, animated: false });
      }, 10);
    }
  }, [modalVisible]);

  const handleHourScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    setSelectedHour(index);
  };

  const handleMinuteScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    setSelectedMinute(index);
  };

  const openModal = () => {
    const { h, m } = parseTime(time);
    setSelectedHour(h);
    setSelectedMinute(m);
    setModalVisible(true);
  };

  const handleCancel = () => {
    const { h, m } = parseTime(time); // restaurar a la hora confirmada
    setSelectedHour(h);
    setSelectedMinute(m);
    setModalVisible(false);
  };

  const handleConfirm = () => {
    const formatted = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setTime(formatted);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.selector} onPress={openModal}>
        <Text style={[styles.timeText, !time && { color: Colors.gray3 }]}>
          {time || label}
        </Text>
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccioná la hora</Text>

            <View style={styles.pickerWrapper}>
              <LinearGradient colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]} style={styles.fadeTop} pointerEvents="none" />

              <View style={styles.pickerInner}>
                <ScrollView
                  ref={hourScrollRef}
                  style={styles.scrollPicker}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={handleHourScroll}
                  contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
                >
                  {hours.map((hour, index) => (
                    <Text key={hour} style={[styles.pickerItem, index === selectedHour && styles.selectedItem]}>
                      {String(hour).padStart(2, '0')}
                    </Text>
                  ))}
                </ScrollView>

                <Text style={[styles.divider, styles.selectedItem]}>:</Text>

                <ScrollView
                  ref={minuteScrollRef}
                  style={styles.scrollPicker}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={handleMinuteScroll}
                  contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
                >
                  {minutes.map((minute, index) => (
                    <Text key={minute} style={[styles.pickerItem, index === selectedMinute && styles.selectedItem]}>
                      {String(minute).padStart(2, '0')}
                    </Text>
                  ))}
                </ScrollView>
              </View>

              <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]} style={styles.fadeBottom} pointerEvents="none" />
            </View>

            {/* Fila de acciones: Cancelar (izq) + Guardar (der) */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimePicker;
