// components/chats/DateSeparator.tsx
import React from 'react';
import { View, Text } from 'react-native';

export function DateSeparator({ date }: { date?: Date }) {
  if (!date) return null;

  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  let label = '';

  if (isSameDay(d, today)) {
    label = 'Hoy';
  } else if (isSameDay(d, yesterday)) {
    label = 'Ayer';
  } else {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    label = `${day}/${month}/${year}`;
  }

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: '#511F73',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginVertical: 8,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}
