import { Colors } from '@/themes/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonWithIconProps {
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

export const ButtonWithIcon = ({ texto, icono, onPress, styles, disabled }: ButtonWithIconProps) => (
  <TouchableOpacity style={[styles.boton, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
    <AntDesign name={icono} size={24} color={Colors.violet4} style={styles.icono} />
    <Text style={styles.texto}>{texto}</Text>
  </TouchableOpacity>
);

