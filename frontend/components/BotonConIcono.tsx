// src/components/BotonConIcono.tsx
import { Colors } from '@/themes/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface BotonConIconoProps {
  texto: string;
  icono: keyof typeof AntDesign.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  styles: {
    boton: StyleProp<ViewStyle>;
    icono: StyleProp<TextStyle>;
    texto: StyleProp<TextStyle>;
  };
}

export const BotonConIcono = ({ texto, icono, onPress, styles, disabled }: BotonConIconoProps) => (
  <TouchableOpacity style={[styles.boton, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
    <AntDesign name={icono} size={24} color={Colors.violet5} style={styles.icono} />
    <Text style={styles.texto}>{texto}</Text>
  </TouchableOpacity>
);

