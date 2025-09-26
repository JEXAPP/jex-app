import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  content: string;                  // nombre de Ionicon o texto
  sizeContent: number;              // tamaño del ícono o texto
  sizeButton?: number;              // diámetro del círculo
  backgroundColor?: string;
  contentColor: string;
  styles: {
    button: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
  };
  accessibilityLabel?: string;
  hitSlop?: number | { top: number; bottom: number; left: number; right: number };
}

export const IconButton: React.FC<Props> = ({
  onPress,
  content,
  sizeContent,
  sizeButton,
  backgroundColor,
  contentColor,
  styles,
  accessibilityLabel,
  hitSlop = 6,
}) => {
  const isIcon = content.length > 1; 

  const diameter = sizeButton ?? sizeContent + 16;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Botón ${content}`}
      hitSlop={hitSlop}
      style={[
        styles.button,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: backgroundColor ?? 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {isIcon ? (
        <Ionicons
          name={content as any}
          size={sizeContent}
          color={contentColor}
          style={StyleSheet.compose(null, {
            includeFontPadding: false,
            textAlignVertical: 'center',
          })}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: contentColor,
              fontSize: sizeContent,
              includeFontPadding: false,
              textAlignVertical: 'center',
            },
          ]}
        >
          {content}
        </Text>
      )}
    </Pressable>
  );
};
