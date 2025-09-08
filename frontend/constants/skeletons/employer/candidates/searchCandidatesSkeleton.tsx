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
  bg = '#D0D4DA',
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

export default function HomeSearchSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.gray1 }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 60,
          paddingBottom: 20,
          gap: 20,
        }}
      >
        <SkeletonBox w={300} h={65} br={Borders.soft}  />

        {/* Header Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <SkeletonBox w={170} h={15} br={Borders.rounded} />
          <SkeletonBox w={170} h={15} br={Borders.rounded} />
        </View>

        <SkeletonBox w={180} h={35} br={Borders.soft} />


        {/* Imagen/ilustración central */}
        <View style={{ alignItems: 'center' }}>
          <SkeletonBox w={350} h={120} br={Borders.soft} />
        </View>


        {/* Inputs (ubicación, disponibilidad, historial) */}
        <View style={{ gap: 14, marginTop: 10 }}>
          <SkeletonBox h={55} br={Borders.soft} stretch />
          <SkeletonBox h={55} br={Borders.soft} stretch />
          <SkeletonBox h={55} br={Borders.soft} stretch />
        </View>

        {/* Botones */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, gap: 12 }}>
          <SkeletonBox w={140} h={48} br={Borders.soft} />
          <SkeletonBox w={140} h={48} br={Borders.soft} />
        </View>
      </ScrollView>
    </View>
  );
}
