import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/themes/colors';
import { Dropdown, DropdownOption } from '@/components/picker/DropDown';
import { SelectableTag } from '@/components/button/SelectableTags';
import { iconos } from '@/constants/iconos';
import { useChooseCandidates } from '@/hooks/employer/candidates/useChooseCandidates';
import { chooseCandidatesStyles as s } from '@/styles/app/employer/candidates/chooseCandidatesStyles';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataTransformation } from '@/services/internal/useDataTransformation';

// 👉 import skeleton
import HomeCandidatesSkeleton from '@/constants/skeletons/employer/candidates/homeCandidatesSkeleton';

export default function ChooseCandidatesScreen() {
  const [loadingScreen, setLoadingScreen] = useState(true);

  const {
    eventName,
    currentEventIndex,
    vacancies, shiftInfo,
    rolePickerVisible, setRolePickerVisible,
    splitFirstSpace,
    selectedRoleLabel, shiftTags, roleOptions, roleAnchorRef,
    selectedVacancyId, currentVacancy, selectedShiftId, candidates,
    loadingEventVacancies, loadingApplications, error,
    hasNoEvents, hasEventsButNoVacanciesGlobal, currentEventHasNoVacancies, hasVacanciesButNoCandidates,
    handlePrevEvent, handleNextEvent, handleSelectVacancy, handleSelectShift, goToCandidateDetail
  } = useChooseCandidates();
  const { formatFechaCorta } = useDataTransformation();

  // 🔥 Simulación de pantalla de carga por 3s
  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 👉 Mientras dura la carga inicial, mostramos solo el skeleton
  if (loadingScreen) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray1 }}>
        <HomeCandidatesSkeleton />
      </SafeAreaView>
    );
  }


  // 1) Sin eventos
  if (hasNoEvents) {
    return (
      <View style={s.container}>
        <Text style={s.title}>Postulantes</Text>
        {/* TODO: Pantalla “sin eventos” */}
        <View style={s.emptyBox}>
          <Text style={s.emptyTitle}>No tenés eventos aún</Text>
          <Text style={s.emptySubtitle}>Creá un evento para empezar a recibir postulaciones.</Text>
        </View>
      </View>
    );
  }

  // 2) Hay eventos pero ninguna vacante global
  if (hasEventsButNoVacanciesGlobal) {
    return (
      <View style={s.container}>
        <Text style={s.title}>Postulantes</Text>
        {/* TODO: Pantalla “sin vacantes” global */}
        <View style={s.emptyBox}>
          <Text style={s.emptyTitle}>Todavía no creaste vacantes</Text>
          <Text style={s.emptySubtitle}>Agregá una vacante a alguno de tus eventos.</Text>
        </View>
      </View>
    );
  }


  // helper para fecha/hora
  const renderShiftSchedule = () => {
    if (!shiftInfo) return null;
    const sameDay = shiftInfo.startDate === shiftInfo.endDate;

    if (sameDay) {
      return (
        <View style={s.scheduleCard}>
          <Text style={s.scheduleTitle}>{formatFechaCorta(shiftInfo.startDate)}</Text>
          <View style={s.scheduleTimesRow}>
            <Text style={s.scheduleTime}>{shiftInfo.startTime}hs</Text>
            <Text style={s.scheduleDash}>-</Text>
            <Text style={s.scheduleTime}>{shiftInfo.endTime}hs</Text>
          </View>
        </View>
      );
    }

    // días distintos -> partir en el primer espacio
    const [w1a, w1b] = splitFirstSpace(formatFechaCorta(shiftInfo.startDate));
    const [w2a, w2b] = splitFirstSpace(formatFechaCorta(shiftInfo.endDate));

    return (
      <View style={[s.scheduleCard, s.scheduleCardSplit]}>
        <View style={s.scheduleCol}>
          <Text style={s.scheduleTitle}>{w1a}{'\n'}{w1b}</Text>
          <Text style={s.scheduleTime}>{shiftInfo.startTime}hs</Text>
        </View>
        <View style={s.scheduleCol}>
          <Text style={s.scheduleTitle}>{w2a}{'\n'}{w2b}</Text>
          <Text style={s.scheduleTime}>{shiftInfo.endTime}hs</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
        <View>
            <Text style={s.title}>Postulantes</Text>

            {/* Header evento con flechas */}
            <View style={s.eventRow}>
                <View style={s.sideSlot}>
                    {currentEventIndex > 0 ? (
                    <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handlePrevEvent}>
                        {iconos.flechaIzquierda(24, Colors.violet4)}
                    </TouchableOpacity>
                    ) : null}
                </View>

                <View style={s.centerSlot}>
                
                    <Text style={s.eventName}>{eventName || '—'}</Text>

                </View>

                <View style={s.sideSlot}>
                    <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handleNextEvent}>
                    {iconos.flechaDerecha(24, Colors.violet4)}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dropdown de Rol (NO mostrar si no hay vacantes) */}
            {vacancies.length > 0 && (
            <>
                <TouchableOpacity
                ref={roleAnchorRef as any}
                style={s.roleAnchor}
                onPress={() => setRolePickerVisible(true)}
                activeOpacity={0.8}
                >
                <Text style={s.roleAnchorText}>{selectedRoleLabel}</Text>
                {iconos.flechaAbajo(20, Colors.violet4)}
                </TouchableOpacity>

                <Dropdown
                visible={rolePickerVisible}
                onClose={() => setRolePickerVisible(false)}
                options={roleOptions as DropdownOption<number>[]}
                selectedValue={selectedVacancyId ?? undefined}
                onSelect={(opt) => handleSelectVacancy(opt.value as number)}
                anchorRef={roleAnchorRef}
                width="anchor"
                placement="below"
                visibleCount={6}
                />
            </>
            )}

            {/* Si el evento actual no tiene vacantes, mostrar vacío del evento */}
            {currentEventHasNoVacancies ? (
            <View style={s.emptyBox}>
                {/* TODO: Pantalla “este evento no tiene vacantes” */}
                <Text style={s.emptyTitle}>Este evento no tiene vacantes</Text>
                <Text style={s.emptySubtitle}>Elegí otro evento o creá una vacante.</Text>
            </View>
            ) : (
            <>
                {/* Tags de Turnos (sin “Todos”) */}
                {currentVacancy && (
                <View style={s.tagsRow}>
                    {shiftTags.map((t) => (
                    <View key={t.id} style={s.badgeContainer}>
                        <SelectableTag
                        title={t.name}
                        selected={selectedShiftId === t.id}
                        onPress={() => handleSelectShift(t.id)}
                        styles={selectableTagStyles2}
                        />
                    </View>
                    ))}
                </View>
                )}

                {currentVacancy && (
                  <View style={s.topInfoRow}>
                    {renderShiftSchedule()}
                    <View style={s.offersCard}>
                      <Text style={s.offersMain}>0/15</Text>
                      <Text style={s.offersSub}>Ofertas Realizadas</Text>
                    </View>
                  </View>
                )}

                {(loadingEventVacancies || loadingApplications) && (
                <View style={s.loadingBox}><ActivityIndicator size="small" /></View>
                )}
                {!!error && <Text style={s.error}>{error}</Text>}

                {/* 3) Hay vacante/turno pero sin postulaciones */}
                {hasVacanciesButNoCandidates && !loadingApplications ? (
                <View style={s.emptyBox}>
                    {/* TODO: Pantalla “sin postulaciones” */}
                    <Text style={s.emptyTitle}>No hay postulaciones</Text>
                    <Text style={s.emptySubtitle}>Compartí tu vacante para recibir candidatos.</Text>
                </View>
                ) : (
                <FlatList
                    data={candidates}
                    keyExtractor={(it) => String(it.id)}
                    numColumns={2}
                    columnWrapperStyle={s.column}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={s.card}
                        onPress={() => goToCandidateDetail(item.id)}
                        activeOpacity={0.85}
                    >
                        <View style={s.avatarWrap}>
                        <Image
                            source={
                            item.avatarUrl
                                ? { uri: item.avatarUrl }
                                : require('@/assets/images/jex/Jex-Postulantes-Default.png')
                            }
                            style={s.avatar}
                        />
                        {/* Si querés el pill de “Vinculado”, ponelo acá */}
                        </View>

                        <Text style={s.name} numberOfLines={1}>{item.fullName}</Text>

                        {/* --- Rating hardcodeado --- */}
                        <View style={s.ratingRow}>
                            <View style={s.starsRow}>
                                {iconos.full_star(14, Colors.violet3)}
                                {iconos.full_star(14, Colors.violet3)}
                                {iconos.full_star(14, Colors.violet3)}
                                {iconos.full_star(14, Colors.violet3)}
                                {iconos.full_star(14, Colors.violet3)}
                            </View>
                        <View style={s.ratingPill}>
                            <Text style={s.ratingText}>5.0</Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                    )}

                />
                )}
            </>
            )}
        </View>
    </SafeAreaView>
  );
}