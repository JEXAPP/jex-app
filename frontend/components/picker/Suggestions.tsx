import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface SItem { descripcion: string; placeId: string }

interface SuggestionsProps {
  sugerencias: SItem[];
  onSeleccionar: (item: SItem) => void;
  styles: {
    contenedor: StyleProp<ViewStyle>;
    item: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;
  };
}

export default function Suggestions({ sugerencias, onSeleccionar, styles }: SuggestionsProps) {
  if (!sugerencias?.length) return null;
  const visibles = sugerencias.slice(0, 4);

  return (
    <View
      style={styles.contenedor}
      pointerEvents="auto"     // ⬅️ clave: dejan pasar toques a los hijos
      collapsable={false}
    >
      {visibles.map((item, i) => (
        <TouchableOpacity
          key={`${item.placeId}-${i}`}
          onPress={() => onSeleccionar(item)}
          style={styles.item}
          activeOpacity={0.7}
        >
          <Text style={styles.texto}>{item.descripcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

