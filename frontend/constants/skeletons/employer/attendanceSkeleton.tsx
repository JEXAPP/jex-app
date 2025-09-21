import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Borders } from '@/themes/borders';

type BoxProps = {
  w: number;
  h: number;
  br?: number;
  mt?: number;
  ml?: number;
  mr?: number;
};

const SkeletonBox = ({ w, h, br = 8, mt = 0, ml = 0, mr = 0 }: BoxProps) => (
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

export default function AttendanceSkeleton() {
  return (
    <View style={{ alignItems: 'center' }}>
      {/* 🔹 Título "Asistencia" */}
      <View style={{ alignSelf: 'flex-start', marginTop: 16, marginLeft: 16 }}>
        <SkeletonBox w={140} h={28} br={Borders.soft} />
      </View>

      {/* 🔹 Card de escaneo (imagen + texto a la derecha) */}
      <View
        style={{
          width: 350,
          alignSelf: 'center',
          marginTop: 16,
          borderRadius: Borders.soft,
        }}
      >
        <SkeletonBox w={350} h={96} br={Borders.soft} />
      </View>

      {/* 🔹 Chips de job types */}
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: 20,
          marginLeft: 16,
          flexDirection: 'row',
        }}
      >
        {[100, 90, 120, 80].map((w, i) => (
          <SkeletonBox key={i} w={w} h={34} br={999} mr={12} />
        ))}
      </View>

      {/* 🔹 Lista en card blanca con filas (nombre + icono a la derecha) */}
      <View
        style={{
          width: 350,
          alignSelf: 'center',
          marginTop: 16,
          borderRadius: Borders.soft,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ marginTop: i === 0 ? 4 : 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <SkeletonBox w={240} h={16} br={Borders.soft} />
              <SkeletonBox w={20} h={20} br={999} ml={12} />
            </View>
            {/* separador */}
            {i < 5 ? <SkeletonBox w={318} h={1} br={1} mt={12} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}
