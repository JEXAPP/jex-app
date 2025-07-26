import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

interface CharCounterProps {
  current: number;
  max: number;
  styles: {
    counter: StyleProp<TextStyle>
  }
}

export const CharCounter = ({ current, max, styles }: CharCounterProps) => {
  return (
    <Text style={styles.counter}>
      {current}/{max}
    </Text>
  );
};