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

export default function Suggestions({
  sugerencias,
  onSeleccionar,
  styles,
}: SuggestionsProps) {
  if (!sugerencias?.length) return null;

  const visibles = sugerencias.slice(0, 4); // máximo 4

  return (
    <View
      style={styles.contenedor}
      pointerEvents="box-only"   // ✔️ el padre no roba los toques detrás
      collapsable={false}        // ✔️ Android: asegura el view en nativo
    >
      {visibles.map((item, index) => (
        <TouchableOpacity
          key={`${item.placeId}-${index}`}
          onPress={() => onSeleccionar(item)}
          style={styles.item}
          activeOpacity={0.7}
          // ❌ NO poner pointerEvents acá; TouchableOpacity no lo soporta
        >
          <Text style={styles.texto}>{item.descripcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
