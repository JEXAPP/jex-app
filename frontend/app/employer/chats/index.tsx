import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
  Image
} from 'react-native';
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
  const {
    options,
    selectedEventId,
    selectEvent,
    loading: loadingEvents,
    error: errorEvents,
  } = useChat();

  const {
    loading: loadingChannels,
    error: errorChannels,
    items,
    hasChannels,
  } = useStreamChannels(selectedEventId || undefined);

  const error = errorEvents ?? errorChannels ?? null;
  const isLoadingAny =
    loadingEvents ||
    (selectedEventId != null && loadingChannels);

  const [visible, setVisible] = useState(false);
  const anchorRef = useRef<View | null>(null);

  const ddOptions: DropdownOption<string>[] = useMemo(
    () => options.map((o) => ({ label: o.title, value: o.id })),
    [options]
  );

  const selectedLabel =
    ddOptions.find((o) => o.value === selectedEventId)?.label ||
    'Seleccionar evento';

  const Header = (
    <View style={s.headerWrap}>
      <View style={s.header}>
        <Text style={s.titles}>Chats</Text>
      </View>

      {!loadingEvents && ddOptions.length > 0 && (
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

      {isLoadingAny && <DotsLoader />}
      {!isLoadingAny && error && (
        <Text style={s.errorText}>Error: {error}</Text>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: (typeof items)[number] }) => (
    <ChatListItem
      title={item.chatTitle ?? 'Chat'}
      subtitle={item.subtitle}
      onPress={() => {
        router.push({
          pathname: '/employer/chats/thread',
          params: { cid: item.id },
        });
      }}
      leftImageSource={item.avatar}
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
              !isLoadingAny && !error && !hasChannels ? (
                <View style={s.noChatsCard}>
                  
                  <Image
                    source={require('@/assets/images/jex/Jex-Sin-Mensajes.webp')}
                    style={s.noChatsImage}
                    resizeMode="contain"
                  />

                  <Text style={s.noChatsTitle}>
                    Este evento aún no tiene chats disponibles
                  </Text>

                </View>
              ) : null
            }
            ListFooterComponent={
              !isLoadingAny && !error && hasChannels ? (
                <View style={{ marginTop: 100, alignItems: 'center'}}>
                  <Image
                    source={require('@/assets/images/jex/Jex-Chats-Empleador.webp')}
                    style={{ width: 250, height: 250}}
                    resizeMode="contain"
                  />
                </View>
              ) : null
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}