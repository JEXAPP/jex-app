// ManipulateVacancySkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

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

export default function ManipulateVacancySkeleton() {
  return (
    <View style={{ flex: 1 }}>
      {/* Header de acciones (tags Ocultar / Mostrar / Editar / Eliminar) */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          <SkeletonBox w={100} h={36} br={18} mr={12} mb={12} />
          <SkeletonBox w={100} h={36} br={18} mr={12} mb={12} />
          <SkeletonBox w={100} h={36} br={18} mr={12} mb={12} />
        </View>
      </View>

      {/* Contenido principal (equivalente al ScrollView) */}
      <View style={{ paddingHorizontal: 26, paddingBottom: 26 }}>
        {/* Header violeta: avatar + título + rating + mapa */}
        <View
          style={{
            backgroundColor: '#EDE7F6', // equivalente visual al header violeta claro
            borderRadius: 16,
            padding: 16,
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          {/* Top: avatar + textos */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom:5 }}>
            <SkeletonBox w={90} h={90} br={90} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <SkeletonBox w={220} h={24} br={8} mt={6} />
              {/* rating pill */}
              <SkeletonBox w={90} h={26} br={13} mt={10} />
            </View>
          </View>

          {/* Mapa */}
          <SkeletonBox w={320} h={80} br={12} mt={4} />
        </View>
        
        <View style={{ marginTop: 5, marginBottom: 5 }}>
            {/* Título del rol */}
            <SkeletonBox w={200} h={50} br={8} mb={6} />
            {/* Descripción */}
            <SkeletonBox w={320} h={20} br={6} mb={8} />
        </View>
        
        <View style={{ marginTop: 5, marginBottom: 5 }}>
            {/* Subtítulo: ¿Qué necesitás? */}
            <SkeletonBox w={160} h={40} br={6} mt={10} mb={8} />
            {/* Requerimientos */}
            <View style={{ marginTop: 5, marginBottom: 5 }}>
                <SkeletonBox w={280} h={16} br={6}  />
            </View>
            <View style={{ marginTop: 5, marginBottom: 5 }}>
                <SkeletonBox w={260} h={16} br={6} />
            </View>
            
        </View>

        <View style={{ marginTop: 10, marginBottom: 10 }}>
            {/* Subtítulo: Turnos disponibles */}
            <SkeletonBox w={160} h={40} br={6} mt={10} mb={8} />
            <View style={{ marginTop: 5, marginBottom: 5 }}>
                <SkeletonBox w={280} h={16} br={6} />
            </View>
        </View>

        <View style={{ marginTop: 10, marginBottom: 10 }}>
        {/* Pills de turnos */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <SkeletonBox w={300} h={40} br={24} mr={12} mb={12} />
          <SkeletonBox w={300} h={40} br={24} mr={12} mb={12} />
          <SkeletonBox w={300} h={40} br={24} mr={12} mb={12} />
        </View> 

        </View>
      </View>
    </View>
  );
}
