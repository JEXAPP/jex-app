import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/themes/colors';
import { Dropdown, DropdownOption } from '@/components/picker/DropDown';
import { SelectableTag } from '@/components/button/SelectableTags';
import { iconos } from '@/constants/iconos';
import { useChooseCandidates } from '@/hooks/employer/candidates/useChooseCandidates';
import { chooseCandidatesStyles as s } from '@/styles/app/employer/candidates/chooseCandidatesStyles';

export default function CandidatesScreen() {
  const {
    // datos y estado
    eventName,
    currentEventIndex,
    vacancies,
    roleOptions,
    roleAnchorRef,
    selectedVacancyId,
    currentVacancy,
    selectedShiftId,
    candidates,
    loadingEventVacancies,
    loadingApplications,
    error,
    // actions
    handlePrevEvent,
    handleNextEvent,
    handleSelectVacancy,
    handleSelectShift,
    goToCandidateDetail,
  } = useChooseCandidates();

  const [rolePickerVisible, setRolePickerVisible] = useState(false);

  const selectedRoleLabel = useMemo(() => {
    const opt = roleOptions.find(o => o.value === selectedVacancyId);
    return opt?.label ?? 'Seleccionar rol';
  }, [roleOptions, selectedVacancyId]);

  const shiftTags = useMemo(() => {
    const ids = currentVacancy?.shiftIds ?? [];
    return ids.map((id, idx) => ({
      id,
      name: `Turno ${idx + 1}`,
    }));
  }, [currentVacancy?.shiftIds]);

  return (
    <View style={s.container}>
      {/* Título */}
      <Text style={s.title}>Postulantes</Text>

      {/* Fila de evento con flechas (tal cual tu snippet) */}
      <View style={s.eventRow}>
        <View style={s.sideSlot}>
          {currentEventIndex > 0 ? (
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handlePrevEvent}>
              {iconos.flechaIzquierda(24, Colors.violet4)}
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={s.eventName}>{eventName || '—'}</Text>

        <View style={s.sideSlot}>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handleNextEvent}>
            {iconos.flechaDerecha(24, Colors.violet4)}
          </TouchableOpacity>
        </View>
      </View>

      {/* Selector de Rol (Dropdown) */}
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

      {/* Tags de Turnos */}
      <View style={s.tagsRow}>
        <SelectableTag
          title="Todos"
          iconName="layers-outline"
          selected={selectedShiftId === null}
          onPress={() => handleSelectShift(null)}
          styles={s.tagStyles}
        />
        {shiftTags.map((t) => (
          <View key={t.id} style={s.badgeContainer}>
            <SelectableTag
              title={t.name}
              iconName="time-outline"
              selected={selectedShiftId === t.id}
              onPress={() => handleSelectShift(t.id)}
              styles={s.tagStyles}
            />
          </View>
        ))}
      </View>

      {/* Loading / Error */}
      {(loadingEventVacancies || loadingApplications) && (
        <View style={s.loadingBox}><ActivityIndicator size="small" /></View>
      )}
      {!!error && <Text style={s.error}>{error}</Text>}

      {/* Grid de candidatos */}
      <FlatList
        data={candidates}
        keyExtractor={(it) => String(it.id)}
        numColumns={2}
        columnWrapperStyle={s.column}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => goToCandidateDetail(item.id)} activeOpacity={0.85}>
            <View style={s.avatarWrap}>
              <Image
                source={
                  item.avatarUrl
                    ? { uri: item.avatarUrl }
                    : require('@/assets/avatar-placeholder.png')
                }
                style={s.avatar}
              />
            </View>
            <Text style={s.name} numberOfLines={1}>{item.fullName}</Text>
            {/* rating si más adelante lo provee el backend */}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loadingApplications ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyTitle}>No hay postulaciones</Text>
              <Text style={s.emptySubtitle}>Seguí explorando para encontrar el candidato ideal</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
