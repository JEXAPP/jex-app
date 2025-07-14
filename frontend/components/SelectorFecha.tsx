import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { selectorFechaStyles as styles } from '@/styles/components/selectorFechaStyles';
import DateTimePicker from '@react-native-community/datetimepicker'

interface SelectorFechaProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export const SelectorFecha = ({ label, value, onChange }: SelectorFechaProps) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setMostrarPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatoFechaHora = (fecha: Date) =>
    `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.selector} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoSelector}>{formatoFechaHora(value)}</Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={value}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};


