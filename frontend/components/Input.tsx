import React from 'react';
import { View, TextInput, StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '../themes/colors';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  styles: {
    input: StyleProp<TextStyle>;
    inputContainer: StyleProp<ViewStyle>;
  };
  showIcon?: boolean;       
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const Input = (props: InputProps) => {
  const { styles, showIcon = false, iconName = 'search', ...rest } = props;

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
        style={styles.input}
        cursorColor={Colors.violet3}
        placeholderTextColor={Colors.gray3}
        {...rest}
      />
    </View>
  );
};
