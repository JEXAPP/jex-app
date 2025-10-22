import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '@/hooks/employer/chats/useChat';
import { chatStyles as s } from '@/styles/app/employer/chats/chatStyles';
import ChatListItem from '@/components/chats/ChatListItem';
import { useStreamChannels } from '@/hooks/employer/chats/useStreamChannels';
import { router } from 'expo-router';
import { Dropdown, DropdownOption } from '@/components/picker/DropDown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { DotsLoader } from '@/components/others/DotsLoader';

export default function ChatScreen() {
  const { options, selectedEventId, selectEvent, loading: loadingEvents, error: errorEvents } = useChat();
  const { loading: loadingChannels, error: errorChannels, items, hasChannels } =
    useStreamChannels(selectedEventId || undefined);

  const error = errorEvents ?? errorChannels ?? null;
  const isLoadingAny = loadingEvents || loadingChannels;

  // Dropdown
  const [visible, setVisible] = useState(false);
  const anchorRef = useRef<View | null>(null);

  const ddOptions: DropdownOption<string>[] = useMemo(
    () => options.map((o) => ({ label: o.title, value: o.id })),
    [options]
  );

  const selectedLabel =
    ddOptions.find((o) => o.value === selectedEventId)?.label || 'Seleccionar evento';

  const Header = (
    <View style={s.headerWrap}>
      <View style={s.header}>
        <Text style={s.titles}>Chats</Text>
      </View>

      {!isLoadingAny && ddOptions.length > 0 && (
        <>
          <Pressable
            ref={anchorRef}
            onPress={() => setVisible(true)}
            style={s.dropdownAnchor}
          >
            <Text style={s.dropdownAnchorText} numberOfLines={1}>
              {selectedLabel}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Colors.violet4} />
          </Pressable>

          <Dropdown
            visible={visible}
            onClose={() => setVisible(false)}
            options={ddOptions}
            selectedValue={selectedEventId ?? undefined}
            onSelect={(opt) => selectEvent(opt.value)}
            anchorRef={anchorRef}
            width="anchor"
            placement="below"
            visibleCount={6}
            itemHeight={44}
            backdropColor="rgba(0,0,0,0.15)"
          />
        </>
      )}

      {isLoadingAny && 
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
          <DotsLoader />
        </SafeAreaView>}
      {!isLoadingAny && error && <Text style={s.errorText}>Error: {error}</Text>}
    </View>
  );

  const renderItem = ({ item }: { item: (typeof items)[number] }) => (
    <ChatListItem
      title={item.chatTitle}      // "Foro Grupal"
      subtitle={item.subtitle}    // último mensaje o copy
      onPress={() => {
        router.push({ pathname: '/employer/chats/thread', params: { cid: item.id } });
      }}
      leftImageSource={item.avatar} // Jex-Foro-Grupal
      avatarBg="#EEE7F4"
    />
  );

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={!isLoadingAny && !error ? items : []}
            keyExtractor={(it) => it.id}
            ListHeaderComponent={Header}
            contentContainerStyle={s.scroll}
            renderItem={renderItem}
            ListEmptyComponent={
              !isLoadingAny && !error ? (
                <View style={s.emptyContainer}>
                  <Text style={s.emptyText}>Aún no hay chats para este evento</Text>
                </View>
              ) : null
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
