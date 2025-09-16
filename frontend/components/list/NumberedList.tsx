// components/others/NumberedList.tsx
import React from 'react';
import { FlatList, Text, View, TextStyle } from 'react-native';
import { Colors } from '@/themes/colors';

type Props = {
  items: string[];
  textStyle?: TextStyle; // 👈 nuevo
};

export function NumberedList({ items, textStyle }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item, idx) => `${idx}-${item.slice(0, 20)}`}
      renderItem={({ item, index }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              width: 22,
              fontSize: 16,
              textAlign: 'left',
              color: Colors.violet4,
              fontFamily: 'titulos',
            }}
          >
            {index + 1}.
          </Text>
          <Text
            style={[
              {
                flex: 1,
                color: Colors.black,
                lineHeight: 20,
              },
              textStyle, // 👈 mergea el estilo que le pases
            ]}
          >
            {item}
          </Text>
        </View>
      )}
      scrollEnabled={false} // para listas largas dentro de ScrollView
    />
  );
}
