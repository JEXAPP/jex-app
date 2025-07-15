import React, { useState } from 'react';
import { Platform, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'

interface SelectorFechaProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  styles: {
    container: StyleProp<ViewStyle>;
    selector: StyleProp<ViewStyle>;
    textoSelector: StyleProp<TextStyle>;
  }
}

export const SelectorFecha = ({ label, value, onChange, styles }: SelectorFechaProps) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setMostrarPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatoFecha = (fecha: Date) =>
    `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoSelector} >
          {value ? formatoFecha(value) : label}
        </Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={value || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};



