// Componente DatePicker con corrección de scroll y selección de meses válidos
import { Colors } from '@/themes/colors';
import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date) => void;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  styles: {
    selector: StyleProp<ViewStyle>;
    dateText: StyleProp<TextStyle>;
    modalOverlay: StyleProp<ViewStyle>;
    modalContent: StyleProp<ViewStyle>;
    modalTitle: StyleProp<TextStyle>;
    pickerContainer: StyleProp<ViewStyle>;
    scrollPicker: StyleProp<ViewStyle>;
    pickerItem: StyleProp<TextStyle>;
    selectedItem: StyleProp<TextStyle>;
    fadeTop: StyleProp<ViewStyle>;
    fadeBottom: StyleProp<ViewStyle>;
    confirmButton: StyleProp<ViewStyle>;
    confirmText: StyleProp<TextStyle>;
  };
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  label = 'Seleccioná una fecha',
  minimumDate,
  maximumDate,
  styles,
}) => {
  const itemHeight = 40;
  const [modalVisible, setModalVisible] = useState(false);
  const today = new Date();

  const minDate = minimumDate || new Date(today.getFullYear(), 0, 1);
  const maxDate = maximumDate || new Date(today.getFullYear(), 11, 31);

  const selectedDate = date && date >= minDate && date <= maxDate ? date : minDate;

  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

  const validYears = Array.from({ length: maxDate.getFullYear() - minDate.getFullYear() + 1 }, (_, i) => minDate.getFullYear() + i);

  let firstDay = 1;
  let lastDay = getDaysInMonth(selectedYear, selectedMonth);

  if (selectedYear === minDate.getFullYear() && selectedMonth === minDate.getMonth()) {
    firstDay = minDate.getDate();
  }
  if (selectedYear === maxDate.getFullYear() && selectedMonth === maxDate.getMonth()) {
    lastDay = maxDate.getDate();
  }

  const days = Array.from({ length: lastDay - firstDay + 1 }, (_, i) => i + firstDay);

  const allMonths = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const validMonths = allMonths.filter((_, index) => {
    const isBeforeMin = selectedYear === minDate.getFullYear() && index < minDate.getMonth();
    const isAfterMax = selectedYear === maxDate.getFullYear() && index > maxDate.getMonth();
    return !(isBeforeMin || isAfterMax);
  });

  const visibleMonthIndex = validMonths.findIndex((_, idx) => {
    const realIndex = allMonths.findIndex(m => m === validMonths[idx]);
    return realIndex === selectedMonth;
  });

  const formatDate = `${selectedDay.toString().padStart(2, '0')}/${(selectedMonth + 1).toString().padStart(2, '0')}/${selectedYear}`;

  useEffect(() => {
    if (modalVisible) {
      const nuevaFecha = new Date(selectedYear, selectedMonth, selectedDay);
      setTimeout(() => {
        dayScrollRef.current?.scrollTo({ y: (nuevaFecha.getDate() - firstDay) * itemHeight, animated: false });
        if (visibleMonthIndex >= 0) {
          monthScrollRef.current?.scrollTo({ y: visibleMonthIndex * itemHeight, animated: false });
        }
        const yearIndex = validYears.findIndex((y) => y === nuevaFecha.getFullYear());
        if (yearIndex !== -1) {
          yearScrollRef.current?.scrollTo({ y: yearIndex * itemHeight, animated: false });
        }
      }, 10);
    }
  }, [modalVisible, selectedYear, selectedMonth, selectedDay, firstDay, validYears, visibleMonthIndex]);

  const confirmDate = () => {
    const nuevaFecha = new Date(selectedYear, selectedMonth, selectedDay);
    nuevaFecha.setHours(0, 0, 0, 0); 

    const min = minimumDate ? new Date(minimumDate) : null;
    const max = maximumDate ? new Date(maximumDate) : null;

    if (min) min.setHours(0, 0, 0, 0);
    if (max) max.setHours(0, 0, 0, 0);

    if ((min && nuevaFecha < min) || (max && nuevaFecha > max)) return;

    setDate(nuevaFecha);
    setModalVisible(false);
  };

  const handleScroll = (setFn: (val: number) => void) => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    setFn(index);
  };

  return (
    <View>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text style={[styles.dateText, !date && { color: Colors.gray3 }]}>
          {date ? formatDate : label}
        </Text>
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccioná tu fecha</Text>

            <View style={styles.pickerContainer}>
              <LinearGradient colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]} style={styles.fadeTop} pointerEvents="none" />

              <ScrollView
                ref={dayScrollRef}
                style={styles.scrollPicker}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll((i) => setSelectedDay(i + firstDay))}
                contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
              >
                {days.map((day) => (
                  <Text
                    key={day}
                    style={[styles.pickerItem, selectedDay === day && styles.selectedItem]}
                  >
                    {day}
                  </Text>
                ))}
              </ScrollView>

              <ScrollView
                ref={monthScrollRef}
                style={styles.scrollPicker}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll((i) => {
                  const realIndex = allMonths.findIndex(m => m === validMonths[i]);
                  if (realIndex !== -1) setSelectedMonth(realIndex);
                })}
                contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
              >
                {validMonths.map((month, i) => {
                  const realIndex = allMonths.findIndex(m => m === month);
                  return (
                    <Text
                      key={month}
                      style={[styles.pickerItem, selectedMonth === realIndex && styles.selectedItem]}
                    >
                      {month}
                    </Text>
                  );
                })}
              </ScrollView>

              <ScrollView
                ref={yearScrollRef}
                style={styles.scrollPicker}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll((val) => setSelectedYear(validYears[val]))}
                contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
              >
                {validYears.map((year) => (
                  <Text
                    key={year}
                    style={[styles.pickerItem, selectedYear === year && styles.selectedItem]}
                  >
                    {year}
                  </Text>
                ))}
              </ScrollView>

              <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]} style={styles.fadeBottom} pointerEvents="none" />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePicker;
