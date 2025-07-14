import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface BotonProps extends TouchableOpacityProps {
  texto: string;
  onPress: () => void;
  styles: {
    boton: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;}
}

export const Boton = ({ texto, onPress, styles, disabled=false}: BotonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.boton,
        styles.boton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.texto,
        ]}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  );
};
