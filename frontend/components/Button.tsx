import React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle, ActivityIndicator} from 'react-native';
import { Colors } from '@/themes/colors'; 

interface ButtonProps extends TouchableOpacityProps {
  texto: string;
  onPress: () => void;
  styles: {
    boton: StyleProp<ViewStyle>;
    texto: StyleProp<TextStyle>;
  };
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({texto, onPress, styles, disabled = false, loading = false, }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.boton]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size='large' color={Colors.white} />
      ) : (
        <Text style={styles.texto}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
};
