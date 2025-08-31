import React from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: any;
  content: string;                  
  sizeContent: number;            
  sizeButton?: number;             
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
  const renderAsCircle = typeof sizeButton === 'number' || !!backgroundColor;

  const diameter = renderAsCircle
    ? sizeButton ?? sizeContent + 16
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Botón ${content}`}
      hitSlop={hitSlop}
      style={[
        styles.button,
        renderAsCircle && {
          width: diameter,
          height: diameter,
          borderRadius: diameter ? diameter / 2 : undefined,
          backgroundColor: backgroundColor ?? 'transparent',
        },
        !renderAsCircle && {
          backgroundColor: 'transparent',
        },
      ]}
    >
      {isIcon ? (
        <Ionicons
          name={content as any}
          size={sizeContent}
          color={contentColor}
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
