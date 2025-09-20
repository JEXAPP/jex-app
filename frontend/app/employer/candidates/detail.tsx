import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';
import { Button } from '@/components/button/Button';
import { ButtonWithIcon } from '@/components/button/ButtonWithIcon';
import { useEmployeeDetail } from '@/hooks/employer/candidates/useEmployeeDetail';
import { employeeDetailStyles as s } from '@/styles/app/employer/candidates/employeeDetailStyles';
import ImageOnline from '@/components/others/ImageOnline';
import { ClickWindow } from '@/components/window/ClickWindow';
import { clickWindowStyles1 } from '@/styles/components/window/clickWindowStyles1';

type RouteParams = { source: 'application' | 'search'; id: string; vacancyId?: string };

export default function EmployeeDetailScreen() {
  const { source, id, vacancyId } = useLocalSearchParams<RouteParams>() as RouteParams;

  const {
    loading, error, data, shiftSummary, goBack, onGenerateOffer,
    confirmRejectVisible, openConfirmReject, closeConfirmReject, confirmReject
  } = useEmployeeDetail({ source, id, vacancyId });

  const headerBadges = useMemo(() => {
    const items: Array<{ icon?: React.ReactNode; text: string; bg: string }> = [];
    if (source === 'search' && data?.approximate_location) {
      items.push({
        icon: <Ionicons name="location-outline" size={18} color={Colors.black} />,
        text: data.approximate_location!,
        bg: Colors.softgreen,
      });
    }
    if (data?.age != null) items.push({ text: `${data.age} Años`, bg: Colors.violet1 });
    return items;
  }, [data, source]);

  const currentCard = data?.shiftCards?.find(c => c.isCurrent);
  const otherCards  = (data?.shiftCards ?? []).filter(c => !c.isCurrent);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.container}>
      {/* Top violeta */}
      <View style={s.topHero}>
        <View style={s.backBtnHero} onTouchEnd={goBack}>
          {iconos.flechaIzquierdaVolver(24, Colors.white)}
        </View>

        <View style={s.topHeroCenter}>
          <ImageOnline imageUrl={data?.profile_image ?? null} size={100} shape="circle" />

          <View style={s.linkedRowCenter}>
            {iconos.usuario_validado(16, Colors.white)}
            <Text style={s.linkedTextCenter}>Usuario Vinculado</Text>
          </View>

          <Text style={s.nameCenter}>{data?.name || '—'}</Text>
          {data?.age != null && <Text style={s.ageCenter}>{data.age} Años</Text>}

          {/* Pills hardcodeadas */}
          <View style={s.pillsRow}>
            <View style={s.pillOutline}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => iconos.full_star(20, Colors.white, i))}
                <Text style={s.pillText}>5.0</Text>
              </View>
            </View>
            <View style={s.pillOutline}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="time-outline" size={20} color={Colors.white} />
                <Text style={s.pillText}>Historial</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Descripción */}
        {loading ? (
          <View style={[s.descCard, s.skeleton]} />
        ) : error ? (
          <View style={s.descCard}><Text style={s.errorText}>{error}</Text></View>
        ) : (
          <View style={s.descCard}><Text style={s.descText}>{data?.description || 'Sin descripción.'}</Text></View>
        )}

        {/* Ubicación solo en búsqueda */}
        {data?.approximate_location && (
          <ImageBackground
            source={require('@/assets/images/maps-blurred.png')}
            imageStyle={s.locationBgImage}
            style={s.locationCard}
          >
            <View style={s.locationInner}>
              <Ionicons name="location" size={18} color={Colors.darkgreen} />
              <Text style={s.locationText}>{data.approximate_location}</Text>
            </View>
          </ImageBackground>
        )}

        {/* Postulación: turno actual + otros turnos */}
        {source === 'application' && (currentCard || otherCards.length > 0) && (
          <>
            {currentCard && <Text style={s.sectionTitle}>Turno Postulado</Text>}
            {currentCard && (
              <View style={s.shiftBlock}>
                <View style={s.shiftRow}>
                  <Text style={s.shiftTime}>{currentCard.time_range_label}</Text>
                  <Text style={s.shiftPay}>{currentCard.payment_label}</Text>
                </View>
                <Text style={s.shiftDateLine}>{currentCard.start_date_label}</Text>
              </View>
            )}

            {otherCards.length > 0 && <Text style={s.sectionTitle}>Otros Turnos Postulados</Text>}
            {otherCards.map((sh, idx) => (
              <View key={sh.id ?? `other-${idx}`} style={s.shiftBlock}>
                <View style={s.shiftRow}>
                  <Text style={s.shiftTime}>{sh.time_range_label}</Text>
                  <Text style={s.shiftPay}>{sh.payment_label}</Text>
                </View>
                <Text style={s.shiftDateLine}>{sh.start_date_label}</Text>
              </View>
            ))}
          </>
        )}

        {/* Acciones */}
        <View style={[s.actionsRow, source === 'search' && { justifyContent: 'center' }]}>
          {source === 'application' && (
            <Button
              texto="Rechazar"
              onPress={openConfirmReject}
              styles={{ boton: s.btnOutline, texto: s.btnOutlineText } as any}
            />
          )}
          <Button
              texto="Me interesa"
              onPress={onGenerateOffer}
              styles={{ boton: s.btnPrimary, texto: s.btnPrimaryText } as any}
            />
        </View>
      </ScrollView>

      {/* ClickWindow de confirmación */}
      <ClickWindow
        visible={confirmRejectVisible}
        title="¿Estás seguro?"
        message="Vas a rechazar esta postulación. Esta acción no puede deshacerse."
        buttonText="Sí, rechazar"
        cancelButtonText="Cancelar"
        icono={<Ionicons name="alert-circle" size={28} color={Colors.violet4} />}
        onClose={confirmReject}
        onCancelPress={closeConfirmReject}
        styles={clickWindowStyles1}
      />
    </SafeAreaView>
  );
}
