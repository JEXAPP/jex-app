// constants/skeletons/employer/editEventSkeleton.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/themes/colors';
import { Borders } from '@/themes/borders';
import { editEventStyles as styles } from '@/styles/app/employer/vacancy/editEventStyles';

type BoxProps = {
  w?: number;   // ancho numérico; si falta y stretch=false, queda en 0 (no ocupa)
  h: number;
  br?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  bg?: string;
  stretch?: boolean; // ocupa el ancho disponible sin width string
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

const Circle = ({
  size,
  mt = 0,
  ml = 0,
  mr = 0,
  bg = '#E1E9EE',
}: {
  size: number;
  mt?: number;
  ml?: number;
  mr?: number;
  bg?: string;
}) => <SkeletonBox w={size} h={size} br={size / 2} mt={mt} ml={ml} mr={mr} bg={bg} />;

export default function EditEventSkeleton() {
  return (
    <View style={[styles.container, { backgroundColor: Colors.gray1 }]}>
      {/* barra superior fantasma */}
      <View style={{ backgroundColor: Colors.gray1 }} />

      <ScrollView contentContainerStyle={[styles.scroll, { gap: 10 }]} keyboardShouldPersistTaps="handled">
        {/* Header: título + imagen */}
        <View style={[styles.header, { marginLeft: 0, gap: 12 }]}>
          {/* Título (dos líneas simuladas) */}
          <View style={{ flexShrink: 1 }}>
            <SkeletonBox w={200} h={35} br={Borders.soft} mt={10} />
          </View>
          {/* Avatar/ilustración */}
          <Circle size={70} />
        </View>

        {/* Input: Nombre del evento */}
        <SkeletonBox h={55} br={Borders.soft} w={350} mt={15} />

        {/* Descripción + contador */}
        <View style={{ marginTop: 15, marginBottom: 4 }}>
          {/* TextArea */}
          <SkeletonBox h={120} br={Borders.soft} stretch />
        </View>

        {/* Picker: Rubro del Evento (label + selector) */}
        <SkeletonBox h={55} br={Borders.soft} mt={15} stretch />

        {/* Input: Ubicación */}
        <SkeletonBox h={55} br={Borders.soft} mt={15} stretch />

        {/* Row1: Fecha inicio + Hora inicio */}
        <View style={[styles.row1, { gap: 20, marginTop: 15, marginBottom: 10, justifyContent: 'center' }]}>
          <View>
            <SkeletonBox w={200} h={55} br={Borders.soft} />
          </View>
          <View>
            <SkeletonBox w={110} h={55} br={Borders.soft} />
          </View>
        </View>

        {/* Row2: Fecha fin + Hora fin */}
        <View style={[styles.row2, { gap: 20, justifyContent: 'center' }]}>
          <View>
            <SkeletonBox w={200} h={55} br={Borders.soft} />
          </View>
          <View>
            <SkeletonBox w={110} h={55} br={Borders.soft} />
          </View>
        </View>
      </ScrollView>

      {/* Row3: Botones Guardar / Eliminar */}
      <View style={[styles.row3, { gap: 15, paddingHorizontal: 15, marginBottom: 16 }]}>
        <SkeletonBox w={150} h={55} br={Borders.soft} />
        <SkeletonBox w={150} h={55} br={Borders.soft} />
      </View>
    </View>
  );
}
