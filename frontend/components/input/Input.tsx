import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  styles: {
    input: StyleProp<TextStyle>;
    inputContainer: StyleProp<ViewStyle>;
  };
  showIcon?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ styles, showIcon = false, iconName = 'search', ...rest }, ref) => {
    const focusAnim = useSharedValue(0);

    const animatedContainerStyle = useAnimatedStyle(() => ({
      borderWidth: 1.5,
      borderColor: interpolateColor(focusAnim.value, [0, 1], ['transparent', Colors.violet3]),
    }));

    const handleFocus = (e: any) => {
      focusAnim.value = withTiming(1, { duration: 200 });
      rest.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      focusAnim.value = withTiming(0, { duration: 200 });
      rest.onBlur?.(e);
    };

    return (
      <Animated.View style={[styles.inputContainer, animatedContainerStyle]}>
        {showIcon && (
          <Ionicons
            name={iconName}
            size={20}
            color={Colors.gray3}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          ref={ref}
          style={styles.input}
          cursorColor={Colors.violet3}
          placeholderTextColor={Colors.gray3}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </Animated.View>
    );
  }
);

Input.displayName = 'Input';