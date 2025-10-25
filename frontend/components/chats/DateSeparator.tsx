// components/chats/DateSeparator.tsx
import React from 'react';
import { View, Text } from 'react-native';

export function DateSeparator({ date }: { date?: Date }) {
  if (!date) return null;

  const formatted = date.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

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
        {formatted}
      </Text>
    </View>
  );
}
