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

  const confirmTime = () => {
    const formatted = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setTime(formatted);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text style={[styles.timeText, !time && { color: Colors.gray3 }]}>
          {time || label}
        </Text>
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
                    <Text
                      key={hour}
                      style={[
                        styles.pickerItem,
                        index === selectedHour && styles.selectedItem,
                      ]}
                    >
                      {String(hour).padStart(2, '0')}
                    </Text>
                  ))}
                </ScrollView>

                <Text
                  style={[
                    styles.divider,
                    styles.selectedItem,
                  ]}
                >
                  :
                </Text>

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
                    <Text
                      key={minute}
                      style={[
                        styles.pickerItem,
                        index === selectedMinute && styles.selectedItem,
                      ]}
                    >
                      {String(minute).padStart(2, '0')}
                    </Text>
                  ))}
                </ScrollView>
              </View>

              <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]} style={styles.fadeBottom} pointerEvents="none" />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={confirmTime}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
      
    </View>
  );
};

export default TimePicker;
