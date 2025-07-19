import React from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import { Colors } from '../themes/colors';

interface InputProps extends TextInputProps {
  styles: {
    input: StyleProp<TextStyle>;
  };
}

export const Input = (props: InputProps) => {
  return (
    <TextInput
      style={props.styles.input}
      cursorColor={Colors.violet3}
      placeholderTextColor={Colors.gray3}
      {...props}
    />
  );
};


