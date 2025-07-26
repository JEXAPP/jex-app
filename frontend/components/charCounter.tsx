import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { charCounterStyles as styles } from '@/styles/components/charCounterStyle'

interface CharCounterProps {
  current: number;
  max: number;
  style?: StyleProp<TextStyle>;
}

export const CharCounter = ({ current, max, style }: CharCounterProps) => {
  return (
    <Text style={[styles.counter, style]}>
      {current}/{max}
    </Text>
  );
};
