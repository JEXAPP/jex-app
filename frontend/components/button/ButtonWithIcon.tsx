import React, { ReactElement } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonWithIconProps {
  texto: string;
  icono: ReactElement;
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
    { icono }
    <Text style={styles.texto}>{texto}</Text>
  </TouchableOpacity>
);

