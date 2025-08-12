import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Borders } from '@/themes/borders';

const SkeletonBox = ({w,h,br = 8,mt = 0,ml = 0,mr = 0,}: {w: number;h: number;br?: number;mt?: number;ml?: number;mr?: number;}) => (
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

export default function HomeSkeleton() {
  return (
    <View style={{ alignItems: 'center'}}>
      {/* 🔹 Barra de búsqueda */}
      <SkeletonBox w={350} h={45} br={Borders.soft} mt={10}/>

      {/* 🔹 Banner principal */}
      <SkeletonBox w={350} h={195} br={Borders.soft} mt={35} />

      {/* 🔹 Sección: Según tus intereses */}
      <View style={{alignItems: 'flex-start', alignSelf:'flex-start'}}>
        <SkeletonBox w={180} h={20} br={Borders.soft} mt={45} />
        <View style={{ flexDirection: 'row', marginTop: 16}}>
          {[...Array(2)].map((_, i) => (
            <View key={i} style={{ marginRight: 50 }}>
              <SkeletonBox w={140} h={140} br={Borders.soft} />
              <SkeletonBox w={100} h={15} br={Borders.soft} mt={8} />
              <SkeletonBox w={80} h={15} br={Borders.soft} mt={8} />
              <SkeletonBox w={60} h={15} br={Borders.soft} mt={8} />
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Sección: Cerca de tu zona */}
      <View style={{alignItems: 'flex-start', alignSelf:'flex-start'}}>
        <SkeletonBox w={180} h={20} br={Borders.soft} mt={45} />
        <View style={{ flexDirection: 'row', marginTop: 16}}>
          {[...Array(2)].map((_, i) => (
            <View key={i} style={{ marginRight: 50 }}>
              <SkeletonBox w={140} h={140} br={Borders.soft} />
              <SkeletonBox w={100} h={15} br={Borders.soft} mt={8} />
              <SkeletonBox w={80} h={15} br={Borders.soft} mt={8} />
              <SkeletonBox w={60} h={15} br={Borders.soft} mt={8} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
