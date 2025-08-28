// DatePicker.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView,
  StyleProp, ViewStyle, TextStyle
} from 'react-native';
import { Colors } from '@/themes/colors';
import { datePickerStyles1 as s } from '@/styles/components/picker/datePickerStyles1';
import { iconos } from '@/constants/iconos';

type Range = { start: Date | null; end: Date | null };

type DatePickerStyles = {
  selector?: StyleProp<ViewStyle>;
  dateText?: StyleProp<TextStyle>;
  selectorText?: StyleProp<TextStyle>;
  modalOverlay?: StyleProp<ViewStyle>;
  modalContent?: StyleProp<ViewStyle>;
  confirmButton?: StyleProp<ViewStyle>;
  confirmText?: StyleProp<TextStyle>;

  // Tabs
  tabs?: StyleProp<ViewStyle>;
  tabItem?: StyleProp<ViewStyle>;
  tabItemActive?: StyleProp<ViewStyle>;
  tabText?: StyleProp<TextStyle>;
  tabTextActive?: StyleProp<TextStyle>;

  // Header
  headerRow?: StyleProp<ViewStyle>;
  headerLeft?: StyleProp<ViewStyle>;
  headerRight?: StyleProp<ViewStyle>;
  headerMonthText?: StyleProp<TextStyle>;

  // Year / Month pickers
  yearList?: StyleProp<ViewStyle>;
  yearItem?: StyleProp<ViewStyle>;
  yearText?: StyleProp<TextStyle>;
  monthGrid?: StyleProp<ViewStyle>;
  monthItem?: StyleProp<ViewStyle>;
  monthItemDisabled?: StyleProp<ViewStyle>;
  monthText?: StyleProp<TextStyle>;

  // Calendar
  weekRow?: StyleProp<ViewStyle>;
  weekCell?: StyleProp<TextStyle>;
  grid?: StyleProp<ViewStyle>;
  row?: StyleProp<ViewStyle>;
  dayCell?: StyleProp<ViewStyle>;
  dayText?: StyleProp<TextStyle>;

  // Selections / states
  daySelected?: StyleProp<ViewStyle>;       // single
  dayTextSelected?: StyleProp<TextStyle>;
  dayOutMonth?: StyleProp<ViewStyle>;
  dayTextOutMonth?: StyleProp<TextStyle>;
  dayDisabled?: StyleProp<ViewStyle>;
  dayTextDisabled?: StyleProp<TextStyle>;

  // Range visuals
  dayRangeEdge?: StyleProp<ViewStyle>;      // extremos del rango (violeta)
  dayRangeMiddle?: StyleProp<ViewStyle>;    // interior del rango (gris)

  // Footer
  footer?: StyleProp<ViewStyle>;
  clearBtn?: StyleProp<ViewStyle>;
  clearText?: StyleProp<TextStyle>;
  applyBtn?: StyleProp<ViewStyle>;
  applyText?: StyleProp<TextStyle>;

  // Container
  overlay?: StyleProp<ViewStyle>;
  card?: StyleProp<ViewStyle>;

  [key: string]: any;
};

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date) => void;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  styles: DatePickerStyles;

  // variantes
  variant?: 'default' | 'inline';
  open?: boolean;                        // para inline (o default controlado)
  onOpenChange?: (open: boolean) => void;

  // defaults
  defaultDate?: Date;

  // rango
  allowRange?: boolean;
  allowModeToggle?: boolean;
  dateRange?: Range;
  setDateRange?: (r: Range) => void;
  defaultRange?: Partial<Range>;
}

type Mode = 'single' | 'range';
type PickerView = 'calendar' | 'year' | 'month';

// Helpers de fecha
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const clamp = (d: Date, min?: Date, max?: Date) => {
  const x = startOfDay(d);
  if (min && x < startOfDay(min)) return startOfDay(min);
  if (max && x > startOfDay(max)) return startOfDay(max);
  return x;
};
const inBounds = (d: Date, min?: Date, max?: Date) => {
  const x = startOfDay(d);
  if (min && x < startOfDay(min)) return false;
  if (max && x > startOfDay(max)) return false;
  return true;
};
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

/** Semanas 6x7 con placeholders (prev/next), filtrando la semana vacía que no contiene días del mes actual */
const weeksOfMonthPadded = (anchor: Date): Date[][] => {
  const y = anchor.getFullYear(), m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const startWeekday = (first.getDay() + 6) % 7; // lunes=0
  const firstCell = new Date(first);
  firstCell.setDate(first.getDate() - startWeekday);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) { const d = new Date(firstCell); d.setDate(firstCell.getDate() + i); cells.push(d); }
  const weeks: Date[][] = []; for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));
  return weeks.filter(w => w.some(d => d.getMonth() === m));
};

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
const fmtRange = (r: Range) =>
  r.start && r.end ? `${fmt(r.start)} – ${fmt(r.end)}`
  : r.start && !r.end ? `${fmt(r.start)} – …`
  : !r.start && r.end ? `… – ${fmt(r.end)}` : '';

const DatePicker: React.FC<DatePickerProps> = ({
  date, setDate, label = 'Seleccioná una fecha',
  minimumDate, maximumDate, styles,
  defaultDate, allowRange = false, allowModeToggle = true,
  dateRange, setDateRange, defaultRange,
  variant = 'default', open, onOpenChange,
}) => {
  // visibilidad (controlado / no controlado)
  const [visibleUncontrolled, setVisibleUncontrolled] = useState(false);
  const isControlled = typeof open === 'boolean';
  const visible = isControlled ? open! : visibleUncontrolled;
  const setVisible = (v: boolean) => (isControlled ? onOpenChange?.(v) : setVisibleUncontrolled(v));

  const today = startOfDay(new Date());
  const [mode, setMode] = useState<Mode>(allowRange ? 'range' : 'single');
  const [view, setView] = useState<PickerView>('calendar');

  // iniciales
  const initialSingle = useMemo(() => {
    if (date) return clamp(date, minimumDate, maximumDate);
    if (defaultDate) return clamp(defaultDate, minimumDate, maximumDate);
    return clamp(today, minimumDate, maximumDate);
  }, [date, defaultDate, minimumDate, maximumDate]);

  const initialRange: Range = useMemo(() => {
    if (dateRange) return {
      start: dateRange.start ? clamp(dateRange.start, minimumDate, maximumDate) : null,
      end: dateRange.end ? clamp(dateRange.end, minimumDate, maximumDate) : null,
    };
    return {
      start: defaultRange?.start ? clamp(defaultRange.start, minimumDate, maximumDate) : null,
      end: defaultRange?.end ? clamp(defaultRange.end, minimumDate, maximumDate) : null,
    };
  }, [dateRange, defaultRange, minimumDate, maximumDate]);

  const [cursorMonth, setCursorMonth] = useState<Date>(
    date ? new Date(date.getFullYear(), date.getMonth(), 1)
      : dateRange?.start ? new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [tmpSingle, setTmpSingle] = useState<Date>(initialSingle);
  const [tmpRange, setTmpRange] = useState<Range>(initialRange);

  // Si el modal se abre desde afuera (variant inline/controlado), inicializamos estados
  useEffect(() => {
    if (visible) {
      setTmpSingle(initialSingle);
      setTmpRange(initialRange);
      setCursorMonth(
        mode === 'single'
          ? new Date(initialSingle.getFullYear(), initialSingle.getMonth(), 1)
          : initialRange.start
            ? new Date(initialRange.start.getFullYear(), initialRange.start.getMonth(), 1)
            : new Date(today.getFullYear(), today.getMonth(), 1)
      );
      setView('calendar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const selectDaySingle = (d: Date) => setTmpSingle(startOfDay(d));
  const selectDayRange = (d: Date) => {
    const day = startOfDay(d);
    const { start, end } = tmpRange;
    if (!start || (start && end)) setTmpRange({ start: day, end: null });
    else setTmpRange(day < start ? { start: day, end: start } : { start, end: day });
  };

  // acciones footer
  const cancelar = () => { setVisible(false); setView('calendar'); };
  const guardar = () => {
    if (mode === 'single') setDate(tmpSingle);
    else setDateRange?.(tmpRange);
    setVisible(false);
    setView('calendar');
  };

  // Header
  const monthName = cursorMonth.toLocaleString('es-AR', { month: 'long' });
  const monthLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${cursorMonth.getFullYear()}`;
  const canPrev = !minimumDate || addMonths(cursorMonth, -1) >= new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1);
  const canNext = !maximumDate || addMonths(cursorMonth, +1) <= new Date(maximumDate.getFullYear(), maximumDate.getMonth(), 1);

  // semanas del mes (con placeholders, sin filas vacías)
  const weeks = useMemo(() => weeksOfMonthPadded(cursorMonth), [cursorMonth]);

  // texto del trigger
  const selectorText = useMemo(() => {
    if (mode === 'single') return date ? fmt(date) : defaultDate ? fmt(defaultDate) : label;
    const txt = dateRange ? fmtRange(dateRange)
      : (defaultRange?.start || defaultRange?.end)
        ? fmtRange({ start: defaultRange.start ?? null, end: defaultRange.end ?? null })
        : '';
    return txt || label;
  }, [mode, date, dateRange, defaultDate, defaultRange, label]);

  // años / meses
  const minY = minimumDate ? minimumDate.getFullYear() : cursorMonth.getFullYear() - 50;
  const maxY = maximumDate ? maximumDate.getFullYear() : cursorMonth.getFullYear() + 50;
  const years = Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const enabledMonth = (y: number, m: number) => {
    const first = new Date(y, m, 1), last = new Date(y, m, daysInMonth(y, m));
    return (!minimumDate || last >= startOfDay(minimumDate)) && (!maximumDate || first <= startOfDay(maximumDate));
  };

  // ---------- CUERPO DEL PICKER ----------
  const PickerBody = () => (
    <View>
      {/* Tabs arriba (si aplica) */}
      {allowRange && allowModeToggle && (
        <View style={s.tabs}>
          {(['single', 'range'] as Mode[]).map((m) => (
            <Pressable key={m} style={[s.tabItem, mode === m && s.tabItemActive]} onPress={() => setMode(m)}>
              <Text style={[s.tabText, mode === m && s.tabTextActive]}>{m === 'single' ? 'Fecha Única' : 'Rango de Fechas'}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Header con mes/año a la izquierda y flechas a la derecha */}
      <View style={[s.headerRow, styles?.headerRow]}>
        <Pressable style={[s.headerLeft, styles?.headerLeft]} onPress={() => setView(view === 'calendar' ? 'year' : 'calendar')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {view === 'calendar' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[s.headerMonthText, styles?.headerMonthText]}>{monthLabel}</Text>
                {iconos.flechaAbajo(18, Colors.violet4)}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {iconos.flechaIzquierda(18, Colors.violet4)}
                <Text style={[s.headerMonthText, styles?.headerMonthText]}>Volver</Text>
              </View>
            )}
          </View>
        </Pressable>

        {view === 'calendar' && (
          <View style={[s.headerRight, styles?.headerRight]}>
            <Pressable disabled={!canPrev} onPress={() => canPrev && setCursorMonth(addMonths(cursorMonth, -1))}>
              <View>{iconos.flechaIzquierda(20, canPrev ? Colors.violet4 : Colors.gray2)}</View>
            </Pressable>
            <Pressable disabled={!canNext} onPress={() => canNext && setCursorMonth(addMonths(cursorMonth, +1))}>
              <View>{iconos.flechaDerecha(20, canNext ? Colors.violet4 : Colors.gray2)}</View>
            </Pressable>
          </View>
        )}
      </View>

      {/* Vistas: Año / Mes / Calendario */}
      {view === 'year' && (
        <ScrollView style={[{ maxHeight: 260 }, styles?.yearList]}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {years.map((y) => (
              <Pressable
                key={y}
                style={[s.yearItem, styles?.yearItem, { width: '30%' }]}
                onPress={() => { setCursorMonth(new Date(y, cursorMonth.getMonth(), 1)); setView('month'); }}
              >
                <Text style={[s.yearText, styles?.yearText]}>{y}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {view === 'month' && (
        <View style={[s.monthGrid, styles?.monthGrid]}>
          {months.map((m, idx) => {
            const y = cursorMonth.getFullYear();
            const enabled = enabledMonth(y, idx);
            return (
              <Pressable
                key={m}
                disabled={!enabled}
                style={[s.monthItem, !enabled && (styles?.monthItemDisabled || s.monthItemDisabled), styles?.monthItem]}
                onPress={() => { setCursorMonth(new Date(y, idx, 1)); setView('calendar'); }}
              >
                <Text style={[s.monthText, styles?.monthText]}>{m}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {view === 'calendar' && (
        <View>
          <View style={s.weekRow}>
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((w) => <Text key={w} style={s.weekCell}>{w}</Text>)}
          </View>

          <View style={[s.grid, styles?.grid]}>
            {weeks.map((week, wi) => (
              <View key={`w-${wi}`} style={[s.row, styles?.row]}>
                {week.map((d, di) => {
                  const isCurrentMonth = d.getMonth() === cursorMonth.getMonth();
                  const within = inBounds(d, minimumDate, maximumDate);
                  const disabled = !isCurrentMonth || !within;

                  // rango
                  const start = tmpRange.start ? startOfDay(tmpRange.start) : null;
                  const end = tmpRange.end ? startOfDay(tmpRange.end) : null;
                  const isStart = !disabled && mode === 'range' && start && isSameDay(d, start);
                  const isEnd = !disabled && mode === 'range' && end && isSameDay(d, end);
                  const isMiddle = !disabled && mode === 'range' && start && end && startOfDay(d) > start && startOfDay(d) < end;

                  // single
                  const isSingle = !disabled && mode === 'single' && isSameDay(d, tmpSingle);

                  return (
                    <Pressable
                      key={`${wi}-${di}-${d.toISOString()}`}
                      style={[
                        s.dayCell,
                        (isStart || isEnd) && (styles?.dayRangeEdge || s.dayRangeEdge),
                        isMiddle && (styles?.dayRangeMiddle || s.dayRangeMiddle),
                        isSingle && s.daySelected,
                        !isCurrentMonth && s.dayOutMonth,
                        disabled && s.dayDisabled,
                      ]}
                      disabled={disabled}
                      onPress={() => (mode === 'single' ? selectDaySingle(d) : selectDayRange(d))}
                    >
                      <Text
                        style={[
                          s.dayText,
                          (isStart || isEnd || isSingle) && s.dayTextSelected,
                          !isCurrentMonth && s.dayTextOutMonth,
                          disabled && s.dayTextDisabled,
                        ]}
                      >
                        {d.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={[s.footer, styles?.footer]}>
        <Pressable onPress={cancelar} style={[s.clearBtn, styles?.clearBtn]}>
          <Text style={[s.clearText, styles?.clearText]}>Cancelar</Text>
        </Pressable>
        <Pressable onPress={guardar} style={[s.applyBtn, styles?.confirmButton]}>
          <Text style={[s.applyText, styles?.confirmText]}>Guardar</Text>
        </Pressable>
      </View>
    </View>
  );

  // ---------- RENDER ----------
  return (
    <View>
      {variant === 'default' && (
        <View>
          {/* Trigger interno */}
          <Pressable
            style={[s.selector, styles?.selector]}
            onPress={() => {
              setTmpSingle(initialSingle);
              setTmpRange(initialRange);
              setCursorMonth(
                mode === 'single'
                  ? new Date(initialSingle.getFullYear(), initialSingle.getMonth(), 1)
                  : initialRange.start
                    ? new Date(initialRange.start.getFullYear(), initialRange.start.getMonth(), 1)
                    : new Date(today.getFullYear(), today.getMonth(), 1)
              );
              setVisible(true);
              setView('calendar');
            }}
          >
            <Text
              style={[
                s.selectorText,
                styles?.dateText ?? styles?.selectorText,
                (!date && !defaultDate && !dateRange && !defaultRange) ? { color: Colors.gray3 } : null,
              ]}
              numberOfLines={1}
            >
              {selectorText}
            </Text>
          </Pressable>

          {/* Modal */}
          <Modal transparent animationType="fade" visible={visible} onRequestClose={cancelar}>
            <View style={[s.overlay, styles?.modalOverlay]}>
              <View style={[s.card, styles?.modalContent]}>
                <PickerBody />
              </View>
            </View>
          </Modal>
        </View>
      )}

      {variant === 'inline' && (
        // Sin input: solo modal (abrís con open/onOpenChange desde afuera)
        <Modal transparent animationType="fade" visible={visible} onRequestClose={cancelar}>
          <View style={[s.overlay, styles?.modalOverlay]}>
            <View style={[s.card, styles?.modalContent]}>
              <PickerBody />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DatePicker;