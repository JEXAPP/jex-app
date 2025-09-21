// stateOffersSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { stateOffersStyles as s } from '@/styles/app/employer/offers/stateOffersStyles';

const SkeletonBox = ({
  w,
  h,
  br = 8,
  mt = 0,
  ml = 0,
  mr = 0,
  mb = 0,
}: {
  w: number;
  h: number;
  br?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  mb?: number;
}) => (
  <MotiView
    style={{
      width: w,
      height: h,
      borderRadius: br,
      marginTop: mt,
      marginLeft: ml,
      marginRight: mr,
      marginBottom: mb,
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

export default function StateOffersSkeleton() {
  return (
    <View style={{ gap: 20, padding: 20, marginTop:150 }}>
      {/* Evento actual con navegación */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonBox w={40} h={40} br={20} />
        <SkeletonBox w={200} h={40} br={20} />
        <SkeletonBox w={40} h={40} br={20} />
      </View>

      {/* Filtros */}
      <View style={{ flexDirection: 'row', gap: 10,  marginTop: 10, alignItems: 'center',justifyContent: 'space-between'  }}>
        {[0, 1, 2].map((i) => (
          <SkeletonBox key={i} w={90} h={30} br={15} />
        ))}
      </View>

      {/* Cards de ofertas */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={[s.offerCard, { width: '100%', padding: 15 }]}>
          {/* Header: imagen + info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <SkeletonBox w={60} h={60} br={30} mr={10} />
            <View>
              <SkeletonBox w={150} h={20} br={6} mb={6} />
              <SkeletonBox w={120} h={14} br={6} />
            </View>
          </View>

          {/* Rol y salario */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <SkeletonBox w={100} h={25} br={12} />
            <SkeletonBox w={80} h={25} br={12} />
          </View>

          {/* Fecha */}
          <SkeletonBox w={200} h={15} br={6} />
        </View>
      ))}
    </View>
  );
}
