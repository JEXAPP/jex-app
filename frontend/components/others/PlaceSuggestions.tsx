import React from 'react';
import {View,Text,TouchableOpacity,ScrollView,StyleProp,TextStyle,ViewStyle,} from 'react-native';

interface PlaceSuggestionsProps {
  sugerencias: { descripcion: string; placeId: string }[];
  onSeleccionar: (item: { descripcion: string; placeId: string }) => void;
  styles: {
    contenedor: StyleProp<ViewStyle>;
    item: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;
  };
}

export default function PlaceSuggestions({
  sugerencias,
  onSeleccionar,
  styles,
}: PlaceSuggestionsProps) {
  if (!sugerencias.length) return null;

  const primeras = sugerencias.slice(0, 10);

  return (
    <View style={styles.contenedor}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        style={{ maxHeight: 200 }} 
      >
        {primeras.map((item, index) => (
          <TouchableOpacity
            key={`${item.placeId}-${index}`}
            onPress={() => onSeleccionar(item)}
            style={styles.item}
          >
            <Text style={styles.texto}>{item.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
