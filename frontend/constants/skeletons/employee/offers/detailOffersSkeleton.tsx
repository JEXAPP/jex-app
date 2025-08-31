// constants/skeletons/employee/offers/detailOffersSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { detailOffersStyles as s } from '@/styles/app/employee/offers/detailOffersStyles';

const SkeletonBox = ({
  w, h, br = 8, mt = 0, ml = 0, mr = 0, mb = 0,
}: { w: number; h: number; br?: number; mt?: number; ml?: number; mr?: number; mb?: number }) => (
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
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

export default function OfferDetailsSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      {/* espacio de header, fuera del scroll */}
      <View />

      {/* contenido scrolleable (card + botones) */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
        <View style={s.card}>
          {/* Imagen del evento */}
          <View style={{ alignItems: 'center' }}>
            <SkeletonBox w={150} h={120} br={12} mt={10}/>
            {/* Empresa y Rol */}
            <SkeletonBox w={180} h={15} br={6} mt={12} />
            <SkeletonBox w={160} h={25} br={6} mt={8} />
            {/* Salario (pill) */}
            <SkeletonBox w={120} h={30} br={8} mt={12} />
            {/* Fecha */}
            <SkeletonBox w={200} h={20} br={6} mt={10} />

          </View>

          {/* Ubicación */}
          <SkeletonBox w={90} h={20} br={6} mt={10} />
          <SkeletonBox w={220} h={18} br={6} mt={6} />

          {/* Mapa */}
          <SkeletonBox w={320} h={100} br={12} mt={12} />

          {/* Requerimientos */}
          <SkeletonBox w={120} h={20} br={6} mt={20} />
          <SkeletonBox w={200} h={16} br={6} mt={8} />
          <SkeletonBox w={200} h={16} br={6} mt={8} />
          <SkeletonBox w={200} h={16} br={6} mt={8} />

          {/* Comentarios */}
          <SkeletonBox w={200} h={20} br={6} mt={20} />
          <SkeletonBox w={320} h={20} br={6} mt={8} />

          {/* Expiración */}
          <View style={{ alignItems: 'center' }}>
            <SkeletonBox w={280} h={16} br={6} mt={20} mb={4} />
          </View>
        </View>

        {/* Botones dentro del scroll (fuera del card) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <SkeletonBox w={160} h={44} br={12} />
          <View style={{ width: 12 }} />
          <SkeletonBox w={160} h={44} br={12} />
        </View>
      </View>
    </View>
  );
}
