// constants/skeletons/employer/homeEventsSkeleton.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';

type BoxProps = {
  w?: number;
  h: number;
  br?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  bg?: string;
  stretch?: boolean;
};

const SkeletonBox = ({
  w,
  h,
  br = 8,
  mt = 0,
  ml = 0,
  mr = 0,
  bg = '#D0D4DA', // un poco más oscuro
  stretch = false,
}: BoxProps) => (
  <MotiView
    style={{
      height: h,
      borderRadius: br,
      marginTop: mt,
      marginLeft: ml,
      marginRight: mr,
      backgroundColor: bg,
      ...(stretch ? { alignSelf: 'stretch' } : { width: w ?? 0 }),
    }}
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

export default function HomeEventsSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.gray1 }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 100, // margen superior para que no quede pegado
          paddingBottom: 20,
          gap: 18,
        }}
      >
        {/* Título evento */}
        <SkeletonBox w={200} h={38} br={Borders.soft} />

        {/* Info evento (inicio, fin, ubicación) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SkeletonBox w={40} h={40} br={20} />
            <SkeletonBox w={250} h={50} br={20} />
            <SkeletonBox w={40} h={40} br={20} />
        </View>

        {/* Input buscar */}
        <SkeletonBox h={85} br={Borders.soft} stretch />


        <SkeletonBox h={55} br={Borders.soft} stretch />

        {/* Chips de filtros */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <SkeletonBox w={100} h={30} br={Borders.rounded} />
          <SkeletonBox w={100} h={30} br={Borders.rounded} />
          <SkeletonBox w={100} h={30} br={Borders.rounded} />
          
        </View>

        {/* Cards de vacantes */}
        <View style={{ gap: 14, marginTop: 10 }}>
          <SkeletonBox h={90} br={Borders.soft} stretch />
          <SkeletonBox h={90} br={Borders.soft} stretch />
          <SkeletonBox h={90} br={Borders.soft} stretch />
          <SkeletonBox h={90} br={Borders.soft} stretch />
        </View>
      </ScrollView>
    </View>
  );
}
