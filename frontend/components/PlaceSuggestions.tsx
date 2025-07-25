import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface PlaceSuggestionsProps {
  sugerencias: string[];
  onSeleccionar: (valor: string) => void;
  styles: {
    contenedor: StyleProp<ViewStyle>;
    item: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;
  }
}

export default function PlaceSuggestions({ sugerencias, onSeleccionar, styles }: PlaceSuggestionsProps) {
  if (!sugerencias.length) return null;

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={sugerencias}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSeleccionar(item)} style={styles.item}>
            <Text style={styles.texto}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


