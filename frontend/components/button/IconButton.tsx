import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface Props {
  onPress: () => void;

  // Opción 1: icono ya renderizado (por ejemplo: iconos.trash(20, Colors.violet4))
  icon?: React.ReactNode;

  // Opción 2: texto simple en el botón (si no pasás icon)
  content?: string;
  sizeContent?: number;             // tamaño del texto si usás content

  sizeButton?: number;              // diámetro del círculo
  backgroundColor?: string;

  styles: {
    button: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
  };

  accessibilityLabel?: string;
  hitSlop?: number | { top: number; bottom: number; left: number; right: number };
}

export const IconButton: React.FC<Props> = ({
  onPress,
  icon,
  content,
  sizeContent = 16,
  sizeButton,
  backgroundColor,
  styles,
  accessibilityLabel,
  hitSlop = 6,
}) => {
  const diameter = sizeButton ?? sizeContent + 16;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? 'Botón'}
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
      {icon ? (
        icon
      ) : content ? (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeContent,
              includeFontPadding: false,
              textAlignVertical: 'center',
            },
          ]}
        >
          {content}
        </Text>
      ) : null}
    </Pressable>
  );
};
