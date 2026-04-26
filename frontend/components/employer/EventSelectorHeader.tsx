import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { Colors } from '@/themes/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalEvent } from '@/app/employer/_layout';
import { eventSelectorHeaderStyles as s } from '@/styles/app/employer/eventSelectorHeaderStyles';
import type { GlobalEvent } from '@/hooks/employer/useGlobalEventSelector';

function getBadgeColors(stateName: string): { bg: string; text: string } {
  switch (stateName) {
    case 'Borrador':     return { bg: Colors.violet1, text: Colors.violet4 };
    case 'Publicado':    return { bg: Colors.violet2, text: Colors.white };
    case 'En ejecución':
    case 'En curso':     return { bg: Colors.violet4, text: Colors.white };
    case 'Finalizado':   return { bg: Colors.gray3,   text: Colors.white };
    default:             return { bg: Colors.violet5,  text: Colors.white };
  }
}

export default function EventSelectorHeader() {
  const { events, currentEvent, setCurrentEvent } = useGlobalEvent();
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback((event: GlobalEvent) => {
    setCurrentEvent(event.id);
    setVisible(false);
  }, [setCurrentEvent]);

  const handleCreate = useCallback(() => {
    setVisible(false);
    router.push('/employer/panel/create-event' as any);
  }, []);

  return (
    <>
      {/* ── Violet header bar ─────────────────────────────── */}
      <Pressable
        onPress={() => setVisible(true)}
        style={[s.headerContainer, { paddingTop: insets.top }]}
        android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
      >
        <View style={s.headerInner}>
          <Text style={s.eventName} numberOfLines={1}>
            {currentEvent?.name ?? 'Sin evento activo'}
          </Text>
          {currentEvent?.state?.name ? (
            <View style={s.headerStatePill}>
              <Text style={s.headerStateText}>{currentEvent.state.name}</Text>
            </View>
          ) : null}
          <Ionicons name="chevron-down" size={16} color={Colors.white} />
        </View>
      </Pressable>

      {/* ── Bottom-sheet modal ────────────────────────────── */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 160 }}
          style={s.overlay}
        >
          {/* Tap backdrop to close */}
          <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)} />

          {/* Sheet springs up */}
          <MotiView
            from={{ translateY: 350 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
          >

            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Seleccionar evento</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={s.closeBtn}>
                <Ionicons name="close" size={22} color={Colors.gray3} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={events}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={s.listContent}
              bounces={false}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <TouchableOpacity
                    style={s.createItem}
                    onPress={handleCreate}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle-outline" size={20} color={Colors.violet4} />
                    <Text style={s.createItemText}>Crear nuevo evento</Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.violet4} />
                  </TouchableOpacity>
                  {events.length > 0 && <View style={s.separator} />}
                </>
              }
              renderItem={({ item }) => {
                const isSelected = item.id === currentEvent?.id;
                const badge = getBadgeColors(item.state.name);
                return (
                  <TouchableOpacity
                    style={[s.eventItem, isSelected && s.eventItemSelected]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.75}
                  >
                    <Text style={s.eventItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={[s.stateBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[s.stateBadgeText, { color: badge.text }]}>
                        {item.state.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </MotiView>
        </MotiView>
      </Modal>
    </>
  );
}
