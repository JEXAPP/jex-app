import React from 'react';
import { View, ScrollView } from 'react-native';
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
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

export default function JobDetailsSkeleton() {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 26 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 16, marginTop: 35 }}>
        <SkeletonBox w={220} h={22} br={Borders.soft} />
        <SkeletonBox w={140} h={18} br={Borders.soft} mt={10} />
      </View>

      {/* Calendario */}
      <SkeletonBox w={350} h={90} br={Borders.soft} mt={6} />

      {/* Card ubicación */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
        <SkeletonBox w={48} h={48} br={24} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <SkeletonBox w={220} h={16} br={Borders.soft} />
          <SkeletonBox w={180} h={14} br={Borders.soft} mt={8} />
        </View>
      </View>

      {/* Row con subCard + pills */}
      <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 16 }}>
        <View style={{ flex: 1 }}>
          <SkeletonBox w={220} h={16} br={Borders.soft} />
          <SkeletonBox w={260} h={14} br={Borders.soft} mt={8} />
          <SkeletonBox w={200} h={14} br={Borders.soft} mt={8} />
        </View>
        <View style={{ width: 130, marginLeft: 12 }}>
          <SkeletonBox w={130} h={56} br={16} />
          <SkeletonBox w={130} h={56} br={16} mt={12} />
        </View>
      </View>

      {/* Card: ¿Qué necesitás? */}
      <View style={{ marginTop: 16 }}>
        <SkeletonBox w={180} h={18} br={Borders.soft} />
        <View style={{ marginTop: 10 }}>
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: i === 0 ? 0 : 10 }}
            >
              <SkeletonBox w={20} h={20} br={10} mr={10} />
              <SkeletonBox w={280} h={14} br={Borders.soft} />
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, marginTop: 16 }}>
        <SkeletonBox w={350} h={48} br={Borders.soft} />
      </View>
    </ScrollView>
  );
}
