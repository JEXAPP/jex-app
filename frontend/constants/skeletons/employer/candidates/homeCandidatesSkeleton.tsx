// constants/skeletons/employer/homeCandidatesSkeleton.tsx
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
  style?: React.CSSProperties | any;
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
  style = {},
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
      ...style,
    }}
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);


export default function HomeCandidatesSkeleton() {
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

        <SkeletonBox w={300} h={45} br={Borders.soft} style={{ alignSelf: 'left' }} />

        {/* Header Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <SkeletonBox w={170} h={25} br={Borders.rounded} />
          <SkeletonBox w={170} h={25} br={Borders.rounded} />
        </View>

        <SkeletonBox w={250} h={35} br={Borders.soft} style={{ alignSelf: 'center' }} />

        {/* Dropdown puesto */}
        <SkeletonBox h={45} br={Borders.soft} stretch />

        {/* Chips: fecha + ofertas realizadas */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <SkeletonBox w={180} h={50} br={Borders.soft} />
          <SkeletonBox w={140} h={50} br={Borders.soft} />
        </View>

        {/* Cards de candidatos */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {[1, 2, 3,4,].map((i) => (
            <View
              key={i}
              style={{
                width: 150,
                height: 120,
                borderRadius: Borders.soft,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                gap: 8,
              }}
            >
              {/* Foto circular */}
              <SkeletonBox w={70} h={70} br={35} />

              {/* Nombre */}
              <SkeletonBox w={100} h={18} br={Borders.rounded} />

              {/* Rating */}
              <SkeletonBox w={60} h={15} br={Borders.rounded} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
