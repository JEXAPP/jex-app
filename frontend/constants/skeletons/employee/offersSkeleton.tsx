import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { activeOffersStyles as s } from '@/styles/app/employee/offers/activeOffersStyles';
import { Colors } from '@/themes/colors';

import { DimensionValue, ViewStyle } from 'react-native';

const SkeletonBox = ({
  w,
  h,
  br = 8,
  style = {},
}: {
  w: DimensionValue;
  h: DimensionValue;
  br?: number;
  style?: ViewStyle;
}) => (
  <MotiView
    style={{ width: w, height: h, borderRadius: br, backgroundColor: '#E1E9EE', ...style }}
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

export default function OfferSkeleton() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 20 }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={[s.offerCard, { width: '100%' }]}>
          {/* Header: imagen + info */}
          <View style={s.offerHeader}>
            <SkeletonBox w={70} h={70} br={10} style={{ marginRight: 10 }} />
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <SkeletonBox w={'50%'} h={20} br={6} style={{ marginBottom: 6 }} />
              <SkeletonBox w={'70%'} h={14} br={6} />
            </View>
          </View>

          {/* Salario */}
          <SkeletonBox w={'40%'} h={20} br={6} style={{ marginVertical: 5 }} />

          {/* Fecha */}
          <SkeletonBox w={'60%'} h={15} br={6} style={{ marginBottom: 8 }} />

          {/* Expiración */}
          <View style={s.expirationContainer}>
            <SkeletonBox w={16} h={16} br={8} />
            <SkeletonBox w={'70%'} h={14} br={6} style={{ marginLeft: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
