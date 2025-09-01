import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Borders } from '@/themes/borders';

const SkeletonBox = ({
  w,
  h,
  br = 8,
  mt = 0,
  ml = 0,
  mr = 0,
}: {
  w: number;
  h: number;
  br?: number;
  mt?: number;
  ml?: number;
  mr?: number;
}) => (
  <MotiView
    style={{
      width: w,
      height: h,
      borderRadius: br,
      marginTop: mt,
      marginLeft: ml,
      marginRight: mr,
      backgroundColor: '#E1E9EE',
    }}
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{
      type: 'timing',
      duration: 800,
      loop: true,
    }}
  />
);

// 🔹 Esqueleto para la pantalla de lista por categoría
export default function SearchVacancySkeleton() {
  return (
    <View style={{ alignItems: 'center'}}>

      {/* 10 cards rectangulares (solo el contorno de la card) */}
      <View>
        {[...Array(10)].map((_, i) => (
          <SkeletonBox
            key={i}
            w={350}
            h={95}
            br={Borders.soft}
            mt={15}
          />
        ))}
      </View>
    </View>
  );
}
