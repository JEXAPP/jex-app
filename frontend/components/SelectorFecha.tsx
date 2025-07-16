import React, { useState } from 'react';
import {
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SelectorFechaProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  styles: {
    container: StyleProp<ViewStyle>;
    selector: StyleProp<ViewStyle>;
    textoSelector: StyleProp<TextStyle>;
  };
}

export const SelectorFecha = ({ label, value, onChange, styles }: SelectorFechaProps) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [fechaTemporal, setFechaTemporal] = useState<Date>(value || new Date(2000, 0, 1));

  const formatoFecha = (fecha: Date) =>
    `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

  const onDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setMostrarPicker(false);
      if (selectedDate) onChange(selectedDate);
    } else {
      if (selectedDate) setFechaTemporal(selectedDate);
    }
  };

  const confirmarYcerrar = () => {
    onChange(fechaTemporal);
    setMostrarPicker(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoSelector}>
          {value ? formatoFecha(value) : label}
        </Text>
      </TouchableOpacity>

      {/* iOS: Modal con fondo tocable */}
      {Platform.OS === 'ios' && mostrarPicker && (
        <Modal transparent animationType="fade" visible={mostrarPicker}>
          <TouchableWithoutFeedback onPress={confirmarYcerrar}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'flex-end',
            }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: 'white' }}>
                  <DateTimePicker
                    value={fechaTemporal}
                    mode="date"
                    display="spinner"
                    locale="es-AR"
                    themeVariant="light"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Android normal */}
      {Platform.OS === 'android' && mostrarPicker && (
        <DateTimePicker
          value={value || new Date(2000, 0, 1)}
          mode="date"
          display="spinner"
          locale="es-AR"
          themeVariant="light"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};