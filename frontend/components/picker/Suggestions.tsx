import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';

interface SItem { descripcion: string; placeId: string }

interface SuggestionsProps {
  sugerencias: SItem[];
  onSeleccionar: (item: SItem) => void;
  styles: {
    contenedor: StyleProp<ViewStyle>;
    item: StyleProp<ViewStyle>;
    divider?: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;
  };
}

export default function Suggestions({ sugerencias, onSeleccionar, styles }: SuggestionsProps) {
  if (!sugerencias?.length) return null;
  const visibles = sugerencias.slice(0, 4);

  return (
    <View
      style={styles.contenedor}
      pointerEvents="auto"
      collapsable={false}
    >
      {visibles.map((item, i) => (
        <React.Fragment key={`${item.placeId}-${i}`}>
          {i > 0 && styles.divider && <View style={styles.divider} />}
          <TouchableOpacity
            onPress={() => onSeleccionar(item)}
            style={styles.item}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={16} color={Colors.violet3} />
            <Text style={styles.texto} numberOfLines={1}>{item.descripcion}</Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

