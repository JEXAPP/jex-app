import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type StylesLike = {
  container?: any;
  label?: any;
  selector?: any;         // el “input” visible
  selectorText?: any;
  modalBackdrop?: any;
  modalCard?: any;
  modalTitle?: any;
  modalActions?: any;
  modalButton?: any;
  modalButtonText?: any;
};

type Props = {
  label?: string;
  date: Date | null;
  setDate: (d: Date | null) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  styles?: StylesLike;
  placeholder?: string;
  // si no querés permitir limpiar, poné false
  allowClear?: boolean;
};

const floorDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const clampDate = (d: Date, min: Date, max: Date) =>
  new Date(Math.min(Math.max(d.getTime(), min.getTime()), max.getTime()));

const fmt = (d: Date) =>
  `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

export default function DatePicker2({
  label,
  date,
  setDate,
  minimumDate,
  maximumDate,
  styles = {},
  placeholder = 'Seleccioná una fecha',
  allowClear = true,
}: Props) {
  const [visible, setVisible] = useState(false);

  // Normalizamos min/max para evitar problemas de TZ/hora
  const { min, max } = useMemo(() => {
    const today = floorDate(new Date());
    const minNorm = minimumDate ? floorDate(minimumDate) : new Date(today.getFullYear(), 0, 1);
    const maxNorm = maximumDate ? floorDate(maximumDate) : new Date(today.getFullYear(), 11, 31);
    return { min: minNorm, max: maxNorm };
  }, [minimumDate?.getTime(), maximumDate?.getTime()]);

  // Estado temporal para el modal (SOLO mientras está abierto)
  const [temp, setTemp] = useState<Date>(floorDate(new Date()));

  // Cuando cambian `date` o los límites, si el modal está cerrado, sincronizamos el temp
  useEffect(() => {
    if (!visible) {
      const base = date ? floorDate(date) : min;
      setTemp(clampDate(base, min, max));
    }
  }, [visible, date?.getTime(), min.getTime(), max.getTime()]);

  const open = () => {
    const base = date ? floorDate(date) : min;
    setTemp(clampDate(base, min, max));
    setVisible(true);
  };

  const onChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    // normalizamos a 00:00
    const clean = floorDate(selected);
    setTemp(clampDate(clean, min, max));
    // en iOS el confirm es manual con botones; en Android modo default confirmamos instantáneo
    if (Platform.OS === 'android') {
      setDate(clean);
      setVisible(false);
    }
  };

  const confirm = () => {
    setDate(temp);
    setVisible(false);
  };

  const cancel = () => setVisible(false);

  const clear = () => {
    setDate(null);
    setVisible(false);
  };

  const displayText = date ? fmt(date) : (label ?? placeholder);

  return (
    <View style={styles.container}>
      {/* Label opcional en el “input” */}
      <TouchableOpacity onPress={open} activeOpacity={0.7} style={styles.selector}>
        <Text style={styles.selectorText}>{displayText}</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={cancel}>
        <Pressable style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }, styles.modalBackdrop]} onPress={cancel}>
          <Pressable style={[{ backgroundColor: '#fff', borderRadius: 16, width: 320, padding: 16 }, styles.modalCard]} onPress={(e) => e.stopPropagation()}>
            <Text style={[{ fontSize: 18, fontWeight: '600', marginBottom: 12 }, styles.modalTitle]}>
              {label ?? 'Seleccioná tu fecha'}
            </Text>

            {/* iOS/Android comparten el mismo componente; en Android confirmarmos en onChange */}
            <DateTimePicker
              mode="date"
              value={temp}
              minimumDate={min}
              maximumDate={max}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />

            {/* En iOS mostramos acciones; en Android podrías ocultarlas si querés */}
            <View style={[{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }, styles.modalActions]}>
              {allowClear && (
                <TouchableOpacity onPress={clear} style={[{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#eee' }, styles.modalButton]}>
                  <Text style={[{ fontWeight: '600' }, styles.modalButtonText]}>Limpiar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={cancel} style={[{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#eee' }, styles.modalButton]}>
                <Text style={[{ fontWeight: '600' }, styles.modalButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirm} style={[{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#6D3AB3' }, styles.modalButton]}>
                <Text style={[{ color: '#fff', fontWeight: '700' }, styles.modalButtonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
