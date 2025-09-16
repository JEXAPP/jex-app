import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/themes/colors';

type Props = {
  /** Fecha del turno a resaltar (ej: "05/09/2025", "2025-09-12" o Date) */
  date: string | Date;
  /** Lunes a Domingo (default lunes) */
  weekStartsOnMonday?: boolean;
  /** Estilos externos opcionales */
  containerStyle?: any;
  /** Color de resaltado (círculo) */
  highlightColor?: string;
};

const dayLabel = (d: Date, locale = 'es-AR') =>
  d.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '').toUpperCase();

const formatMonthYear = (d: Date, locale = 'es-AR') => {
  const month = d.toLocaleDateString(locale, { month: 'short' }).replace('.', '').toUpperCase();
  const year = d.getFullYear();
  return `${month} ${year}`;
};

const getStartOfWeek = (d: Date, mondayStart: boolean) => {
  const copy = new Date(d);
  const day = copy.getDay(); // 0 = dom ... 6 = sáb
  const offset = mondayStart ? (day === 0 ? -6 : 1 - day) : -day;
  copy.setDate(copy.getDate() + offset);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const coerceLocalDate = (input: string | Date) => {
  if (input instanceof Date) return input;

  // 👉 Caso A: formato "DD/MM/YYYY"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split('/').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  // 👉 Caso B: formato "YYYY-MM-DD" o ISO con Z
  const base = new Date(input);
  const looksUTC =
    typeof input === 'string' &&
    (/^\d{4}-\d{2}-\d{2}$/.test(input) || /Z$/.test(input));

  const localish = looksUTC
    ? new Date(base.getTime() + base.getTimezoneOffset() * 60000)
    : base;

  return new Date(
    localish.getFullYear(),
    localish.getMonth(),
    localish.getDate()
  );
};

export default function StaticWeekCalendar({
  date,
  weekStartsOnMonday = true,
  containerStyle,
  highlightColor = Colors.violet4,
}: Props) {
  const target = useMemo(() => coerceLocalDate(date), [date]);

  const { weekDays, headerText } = useMemo(() => {
    const start = getStartOfWeek(target, weekStartsOnMonday);
    const arr: Date[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    return {
      weekDays: arr,
      headerText: formatMonthYear(target),
    };
  }, [target, weekStartsOnMonday]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <View
      style={[
        {
          backgroundColor: '#F4F4F6',
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 12,
        },
        containerStyle,
      ]}
    >
      {/* Encabezado: MES AÑO */}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontFamily: "interBold",
          color: Colors.black,
        }}
      >
        {headerText}
      </Text>

      {/* Nombres de días */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        {weekDays.map((d, idx) => (
          <Text
            key={idx}
            style={{
              fontSize: 11,
              color: '#7A7A7A',
              width: 28,
              textAlign: 'center',
            }}
          >
            {dayLabel(d)}
          </Text>
        ))}
      </View>

      {/* Números + highlight */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        {weekDays.map((d, idx) => {
          const active = isSameDay(d, target);
          return (
            <View key={idx} style={{ width: 28, alignItems: 'center' }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? highlightColor : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: active ? '#FFFFFF' : Colors.violet4,
                  }}
                >
                  {d.getDate()}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
