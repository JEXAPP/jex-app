import { homeOffersStyles as s } from '@/styles/app/employee/offers/homeOffersStyles';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

const SkeletonBox = ({w,h,br = 8,mt = 0,ml = 0,mr = 0, mb= 0}: {w: number;h: number;br?: number;mt?: number;ml?: number;mr?: number; mb?: number;}) => (
  <MotiView
    style={{
      width: w,
      height: h,
      borderRadius: br,
      marginTop: mt,
      marginLeft: ml,
      marginRight: mr,
      marginBottom : mb,
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

export default function HomeOfferSkeleton() {
  return (
    <View style={{ gap: 20 }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[s.offerCard, { width: '100%' }]}>
          {/* Header: imagen + info */}
          <View style={s.offerHeader}>
            <SkeletonBox w={70} h={70} br={10} mt={5} mr={10} />
            <View style={{ justifyContent: 'flex-start' }}>
              <SkeletonBox w={150} h={20} br={6} mt={18} />
              <SkeletonBox w={200} h={14} br={6} mt={10}/>
            </View>
          </View>

          {/* Salario */}
          <SkeletonBox w={100} h={20} br={6} mb={10} />

          {/* Fecha */}
          <SkeletonBox w={200} h={15} br={6} mb={10} />

          {/* Expiración */}
          <SkeletonBox w={300} h={14} br={6} />
        </View>
      ))}
    </View>
  );
}
