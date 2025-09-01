// constants/skeletons/employer/editVacancySkeleton.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';
import { editVacancyStyles as styles } from '@/styles/app/employer/vacancy/editVacancyStyles';

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
  bg = '#E1E9EE',
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
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

const Circle = ({ size, mt = 0, ml = 0, mr = 0, bg = '#E1E9EE' }: { size: number; mt?: number; ml?: number; mr?: number; bg?: string }) => (
  <SkeletonBox w={size} h={size} br={size / 2} mt={mt} ml={ml} mr={mr} bg={bg} />
);

export default function EditVacancySkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: Colors.gray1 }]}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, marginTop: 50 }}>
          <Circle size={130} />
          <View style={{ flex: 1 }}>
            <SkeletonBox w={260} h={28} br={Borders.soft} stretch />
            <SkeletonBox w={180} h={24} br={Borders.soft} mt={10} />
          </View>
        </View>

        {/* Card Vacante */}
        <View
          style={{
            padding: 20,
            marginBottom: 20,
            backgroundColor: Colors.gray1,
          }}
        >
          {/* Subtítulo + botón carpeta */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
            <SkeletonBox w={120} h={22} br={Borders.soft} />
            <Circle size={28} ml={95} />
          </View>

          {/* DropDown */}
          <SkeletonBox w={320} h={45} br={Borders.soft} />

          {/* "Rol Específico" */}
          <SkeletonBox w={310} h={45} br={Borders.soft} mt={15} />

          {/* Descripción + contador */}
          <SkeletonBox w={310} h={80} br={Borders.soft} mt={15} />
          <SkeletonBox w={80} h={14} br={Borders.soft} mt={8} />

          {/* Agregar Requerimiento */}
          <SkeletonBox w={240} h={44} br={Borders.soft} mt={20} />

          {/* Requerimientos */}
          {[...Array(2)].map((_, i) => (
            <View
              key={`req-${i}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 20,
                marginTop: i === 0 ? 20 : 0,
              }}
            >
              <SkeletonBox w={270} h={40} br={Borders.soft} />
              <Circle size={40} bg={'#D7DEE5'} />
            </View>
          ))}

          {/* Turno (1 bloque) */}
          <View
            style={{
              borderRadius: 8,
              paddingHorizontal: 20,
              marginBottom: 16,
              paddingBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20, marginBottom: 20 }}>
              <SkeletonBox w={110} h={20} br={Borders.soft} bg={'#E1E9EE'} />
              <Circle size={28} bg={'#E1E9EE'} />
            </View>

            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
              <SkeletonBox w={140} h={40} br={Borders.soft} />
              <SkeletonBox w={110} h={40} br={Borders.soft} />
            </View>

            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
              <SkeletonBox w={140} h={40} br={Borders.soft} />
              <SkeletonBox w={110} h={40} br={Borders.soft} />
            </View>

            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
              <SkeletonBox w={270} h={40} br={Borders.soft} />
            </View>

            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
              <SkeletonBox w={270} h={40} br={Borders.soft} />
            </View>

            <SkeletonBox w={200} h={40} br={Borders.soft} />
          </View>

          {/* Agregar turno */}
          <SkeletonBox w={250} h={44} br={Borders.soft} />
        </View>

        {/* Botón Guardar cambios */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          <SkeletonBox w={300} h={50} br={Borders.soft} />
        </View>
      </View>
    </ScrollView>
  );
}
