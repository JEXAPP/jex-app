import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/themes/colors';
import { Dropdown, DropdownOption } from '@/components/picker/DropDown';
import { SelectableTag } from '@/components/button/SelectableTags';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import { iconos } from '@/constants/iconos';
import { useChooseCandidates } from '@/hooks/employer/candidates/useChooseCandidates';
import { chooseCandidatesStyles as s } from '@/styles/app/employer/candidates/chooseCandidatesStyles';
import { useDataTransformation } from '@/services/internal/useDataTransformation';

import ChooseCandidatesSkeleton from '@/constants/skeletons/employer/candidates/chooseCandidatesSkeleton';
import { ApplicantsSquaresSkeleton } from '@/constants/skeletons/employer/candidates/applicantsSquaresSkeleton';
export default function ChooseCandidatesScreen() {
  const [loadingScreen, setLoadingScreen] = useState(true);

  const {
    eventName,
    currentEventIndex,
    vacancies,
    roleOptions,
    roleAnchorRef,
    selectedRoleLabel,
    selectedVacancyId,
    currentVacancy,
    shiftTags,
    selectedShiftId,
    candidates,
    shiftInfo,

    // ofertas (se cargan junto con horario y postulaciones)
    offersMade,
    offersMax,
    isFull,

    // ui state
    rolePickerVisible,
    setRolePickerVisible,
    loadingEventVacancies,
    loadingApplications,
    error,

    // vacíos
    hasNoEvents,
    currentEventHasNoVacancies,
    hasVacanciesButNoCandidates,

    // acciones
    handlePrevEvent,
    handleNextEvent,
    handleSelectVacancy,
    handleSelectShift,
    openCandidateDetail,
    // utils
    splitFirstSpace,
  } = useChooseCandidates();

  const { formatFechaCorta } = useDataTransformation();

  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 🔸 Skeleton de página completa durante: splash local o carga de eventos/vacantes
  if (loadingScreen || loadingEventVacancies) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray1 }}>
        <ChooseCandidatesSkeleton />
      </SafeAreaView>
    );
  }

  // 1) Sin eventos
  if (hasNoEvents) {
    return (
      <View style={s.container}>
        <View style={s.emptyBox}>
          <Text style={s.emptyTitle}>No tenés eventos aún</Text>
          <Image
            source={require('@/assets/images/jex/Jex-Sin-Eventos.png')}
            style={s.emptyImage}
            resizeMode="contain"
          />
          <Text style={s.emptySubtitle}>Creá un evento para recibir postulaciones</Text>
        </View>
      </View>
    );
  }

  // helper visual para fecha/hora del turno
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

    // días distintos → partir en el primer espacio
    const [w1a, w1b] = splitFirstSpace(formatFechaCorta(shiftInfo.startDate));
    const [w2a, w2b] = splitFirstSpace(formatFechaCorta(shiftInfo.endDate));

    return (
      <View style={[s.scheduleCard, s.scheduleCardSplit]}>
        <View style={s.scheduleCol}>
          <Text style={s.scheduleTitle}>
            {w1a}
            {'\n'}
            {w1b}
          </Text>
          <Text style={s.scheduleTime}>{shiftInfo.startTime}hs</Text>
        </View>
        <View style={s.scheduleCol}>
          <Text style={s.scheduleTitle}>
            {w2a}
            {'\n'}
            {w2b}
          </Text>
          <Text style={s.scheduleTime}>{shiftInfo.endTime}hs</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <View>
        {/* Header evento con flechas */}
        <View style={s.eventRow}>
          <View style={s.sideSlot}>
            {currentEventIndex > 0 ? (
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={handlePrevEvent}
              >
                {iconos.flechaIzquierda(24, Colors.violet4)}
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={s.centerSlot}>
            <Text style={s.eventName}>{eventName || '—'}</Text>
          </View>

          <View style={s.sideSlot}>
            <TouchableOpacity
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={handleNextEvent}
            >
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
          <View style={s.emptyBox2}>
            <Text style={s.emptyTitle}>No hay vacantes activas</Text>
            <Image
              source={require('@/assets/images/jex/Jex-Sin-Vacantes.png')}
              style={s.emptyImage}
              resizeMode="contain"
            />
            <Text style={s.emptySubtitle}>Publicá una vacante para recibir postulaciones</Text>
          </View>
        ) : (
          <>
            {/* Tags de Turnos (solo si hay más de un turno) — no skeletonizar */}
            {currentVacancy && shiftTags && (
              <View style={s.tagsRow}>
                {shiftTags.map((t) => {
                  const isSelected = selectedShiftId === t.id;
                  return (
                    <View key={t.id} style={s.badgeContainer}>
                      <SelectableTag
                        title={t.name}
                        selected={isSelected}
                        onPress={isSelected ? () => {} : () => handleSelectShift(t.id)}
                        styles={selectableTagStyles2}
                      />
                    </View>
                  );
                })}
              </View>
            )}

            {/* Info superior: horario + ofertas */}
            {currentVacancy && (
              <View style={s.topInfoRow}>
                {renderShiftSchedule()}
                {/* No mostrar nada mientras carga las ofertas */}
                {offersMade !== null && offersMax !== null && (
                  <View style={s.offersCard}>
                    <Text style={s.offersMain}>
                      {offersMade}/{offersMax}
                    </Text>
                    <Text style={s.offersSub}>Ofertas realizadas</Text>
                  </View>
                )}
              </View>
            )}

            {/* ⏳ Mientras cargan sólo postulaciones → Skeleton de cuadrados */}
            {loadingApplications && (
              <View style={{ paddingVertical: 8 }}>
                <ApplicantsSquaresSkeleton />
              </View>
            )}

            {!!error && <Text style={s.error}>{error}</Text>}

            {/* Si el turno está lleno: NO mostrar solicitudes ni grilla */}
            {!loadingApplications && isFull ? (
              <View style={s.emptyBox3}>
                <Text style={s.emptyTitle}>Turno Lleno</Text>
                <Image
                  source={require('@/assets/images/jex/Jex-Postulacion-Lleno.png')}
                  style={s.emptyImage2}
                  resizeMode="contain"
                />
                <Text style={s.emptySubtitle}>
                  Alcanzaste el máximo de ofertas para este turno
                </Text>
              </View>
            ) : (
              <>
                {/* 🛈 Sin postulaciones (sólo cuando terminó de cargar) */}
                {!loadingApplications && hasVacanciesButNoCandidates ? (
                  <View style={s.emptyBox3}>
                    <Text style={s.emptyTitle}>No hay postulaciones</Text>
                    <Image
                      source={require('@/assets/images/jex/Jex-Postulacion-Vacio.png')}
                      style={s.emptyImage3}
                      resizeMode="contain"
                    />
                    <Text style={s.emptySubtitle}>
                      Compartí tu vacante para recibir candidatos
                    </Text>
                  </View>
                ) : null}

                {/* 👇 Grilla de candidatos (nunca mientras está cargando) */}
                {!loadingApplications && candidates.length > 0 && (
                  <FlatList
                    data={candidates}
                    keyExtractor={(it) => String(it.id)}
                    numColumns={2}
                    columnWrapperStyle={s.column}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={s.card}
                        activeOpacity={0.85}
                        onPress={() => openCandidateDetail(item.id)}
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
                        </View>

                        <Text style={s.name} numberOfLines={1}>
                          {item.fullName}
                        </Text>

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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
