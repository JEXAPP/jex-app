import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface SeparadorConTextoProps {
  texto: string;
  styles: {
    container: StyleProp<ViewStyle>;
    line: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
  };
}

export const SeparadorConTexto = ({texto, styles}: SeparadorConTextoProps) => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.text}>{texto}</Text>
    <View style={styles.line} />
  </View>
);

