import React from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import { Colors } from '@/themes/colors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { DotsLoader } from '@/components/others/DotsLoader';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

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
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 12, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 12, stiffness: 300 }); };

  return (
    <AnimatedTouchable
      style={[styles.boton, animStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <DotsLoader size={8} color={Colors.white} />
      ) : (
        <Text style={styles.texto}>{texto}</Text>
      )}
    </AnimatedTouchable>
  );
};
