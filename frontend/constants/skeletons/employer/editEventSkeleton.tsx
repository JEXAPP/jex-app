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
      <View style={[styles.seccion, { backgroundColor: Colors.gray1 }]} />

      <ScrollView contentContainerStyle={[styles.scroll, { gap: 10 }]} keyboardShouldPersistTaps="handled">
        {/* Header: título + imagen */}
        <View style={[styles.header, { marginLeft: 0, gap: 12 }]}>
          {/* Título (dos líneas simuladas) */}
          <View style={{ flexShrink: 1 }}>
            <SkeletonBox w={260} h={28} br={Borders.soft} stretch />
            <SkeletonBox w={180} h={22} br={Borders.soft} mt={10} />
          </View>
          {/* Avatar/ilustración */}
          <Circle size={80} />
        </View>

        {/* Input: Nombre del evento */}
        <SkeletonBox h={46} br={Borders.soft} stretch />

        {/* Descripción + contador */}
        <View style={{ marginTop: 8, marginBottom: 4 }}>
          {/* TextArea */}
          <SkeletonBox h={120} br={Borders.soft} stretch />
        </View>

        {/* Picker: Rubro del Evento (label + selector) */}
        <View style={{ marginTop: 4 }}>
           <SkeletonBox h={46} br={Borders.soft} stretch />
        </View>

        {/* Input: Ubicación */}
        <SkeletonBox h={46} br={Borders.soft} stretch />

        {/* Row1: Fecha inicio + Hora inicio */}
        <View style={[styles.row1, { gap: 30, marginTop: 15, marginBottom: 10, justifyContent: 'center' }]}>
          <View>
            <SkeletonBox w={140} h={46} br={Borders.soft} />
          </View>
          <View>
            <SkeletonBox w={100} h={46} br={Borders.soft} />
          </View>
        </View>

        {/* Row2: Fecha fin + Hora fin */}
        <View style={[styles.row2, { gap: 30, justifyContent: 'center' }]}>
          <View>
            <SkeletonBox w={140} h={46} br={Borders.soft} />
          </View>
          <View>
            <SkeletonBox w={100} h={46} br={Borders.soft} />
          </View>
        </View>
      </ScrollView>

      {/* Row3: Botones Guardar / Eliminar */}
      <View style={[styles.row3, { gap: 15, paddingHorizontal: 26, marginBottom: 16 }]}>
        <SkeletonBox w={120} h={46} br={Borders.soft} />
        <SkeletonBox w={120} h={46} br={Borders.soft} />
      </View>
    </View>
  );
}
