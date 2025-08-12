import { Colors } from '@/themes/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

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
    return (
      <View style={styles.inputContainer}>
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
          {...rest}
        />
      </View>
    );
  }
);

Input.displayName = 'Input';