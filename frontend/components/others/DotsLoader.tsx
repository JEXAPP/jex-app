import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/themes/colors';

interface DotsLoaderProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({
  size = 9,
  color = Colors.violet4,
  style,
}) => {
  return (
    <View
      style={[
        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        style,
      ]}
    >
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3, translateY: 0 }}
          animate={{ opacity: 1, translateY: -(size * 0.55) }}
          transition={{
            type: 'timing',
            duration: 480,
            delay: i * 180,
            loop: true,
          }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            marginHorizontal: size * 0.45,
          }}
        />
      ))}
    </View>
  );
};
