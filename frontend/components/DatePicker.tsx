import { Colors } from '@/themes/colors';
import React, { useEffect, useState } from 'react';
import {Modal, View, Text, TouchableOpacity,ScrollView, StyleProp, ViewStyle, TextStyle} from 'react-native';

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date) => void;
  label?: string;
  minYear?: number;
  maxYear?: number;
  maximumDate?: Date;
  minimumDate?: Date;
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
    confirmButton: StyleProp<ViewStyle>;
    confirmText: StyleProp<TextStyle>;
  };
}


const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  label = 'Seleccioná una fecha',
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  styles
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedDate = date || new Date();

  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const formatDate = `${selectedDay.toString().padStart(2, '0')}/${(selectedMonth + 1)
    .toString()
    .padStart(2, '0')}/${selectedYear}`;

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();};
  

  const days = Array.from(
  { length: getDaysInMonth(selectedYear, selectedMonth) },
  (_, i) => i + 1);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);


  const confirmDate = () => {
    const nuevaFecha = new Date(selectedYear, selectedMonth, selectedDay);
    setDate(nuevaFecha);
    setModalVisible(false);
  };

  useEffect(() => {
  const maxDay = getDaysInMonth(selectedYear, selectedMonth);
  if (selectedDay > maxDay) {
    setSelectedDay(maxDay); 
  }
    }, [selectedMonth, selectedYear, selectedDay]);


  return (
    <View>


      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text style={[
          styles.dateText,
          !date && { color:Colors.gray3, fontFamily: 'interMedium' }
        ]}>
          {date ? formatDate : label}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Seleccioná tu fecha</Text>

            <View style={styles.pickerContainer}>
              <ScrollView style={styles.scrollPicker}>
                {days.map((day) => (
                  <Text
                    key={day}
                    style={[
                      styles.pickerItem,
                      selectedDay === day && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    {day}
                  </Text>
                ))}
              </ScrollView>

              <ScrollView style={styles.scrollPicker}>
                {months.map((month, index) => (
                  <Text
                    key={month}
                    style={[
                      styles.pickerItem,
                      selectedMonth === index && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    {month}
                  </Text>
                ))}
              </ScrollView>

              <ScrollView style={styles.scrollPicker}>
                {years.map((year) => (
                  <Text
                    key={year}
                    style={[
                      styles.pickerItem,
                      selectedYear === year && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    {year}
                  </Text>
                ))}
              </ScrollView>
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
