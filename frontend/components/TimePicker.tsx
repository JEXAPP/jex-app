import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TimePickerProps {
  time: string | null;
  setTime: (time: string) => void;
  styles: {
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

const TimePicker: React.FC<TimePickerProps> = ({ time, setTime, styles }) => {
  const itemHeight = 40;
  const [selectedHour, setSelectedHour] = useState<number>(
    time ? parseInt(time.split(':')[0]) : 0
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    time ? parseInt(time.split(':')[1]) : 0
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    hourScrollRef.current?.scrollTo({ y: selectedHour * itemHeight, animated: false });
    minuteScrollRef.current?.scrollTo({ y: selectedMinute * itemHeight, animated: false });
  }, []);

  const handleHourScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / itemHeight);
    setSelectedHour(index);
  };

  const handleMinuteScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / itemHeight);
    setSelectedMinute(index);
  };

  const confirmTime = () => {
    const formatted = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setTime(formatted);
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Seleccioná la hora</Text>

      <View style={styles.pickerWrapper}>
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
          style={styles.fadeTop}
          pointerEvents="none"
        />

        <View style={styles.pickerInner}>
          {/* Horas */}
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
                style={[styles.pickerItem, index === selectedHour && styles.selectedItem]}
              >
                {String(hour).padStart(2, '0')}
              </Text>
            ))}
          </ScrollView>

          <Text style={[styles.divider, styles.selectedItem]}>:</Text>

          {/* Minutos */}
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
                style={[styles.pickerItem, index === selectedMinute && styles.selectedItem]}
              >
                {String(minute).padStart(2, '0')}
              </Text>
            ))}
          </ScrollView>
        </View>

        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={confirmTime}>
        <Text style={styles.confirmText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimePicker;