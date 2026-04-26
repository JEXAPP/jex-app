import React from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatStyles as s } from '@/styles/app/employer/chats/chatStyles';
import ChatListItem from '@/components/chats/ChatListItem';
import { useStreamChannels } from '@/hooks/employer/chats/useStreamChannels';
import { router } from 'expo-router';
import { DotsLoader } from '@/components/others/DotsLoader';
import { useGlobalEvent } from '@/app/employer/_layout';
import EventSelectorHeader from '@/components/employer/EventSelectorHeader';

export default function ChatScreen() {
  const { currentEvent } = useGlobalEvent();

  const {
    loading: loadingChannels,
    error: errorChannels,
    items,
    hasChannels,
  } = useStreamChannels(currentEvent ? String(currentEvent.id) : undefined);

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
    <SafeAreaView style={s.container} edges={['left', 'right']}>
      <EventSelectorHeader />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={!loadingChannels && !errorChannels ? items : []}
            keyExtractor={(it) => it.id}
            ListHeaderComponent={
              <View style={s.headerWrap}>
                <View style={s.header}>
                  <Text style={s.titles}>Chats</Text>
                </View>
                {loadingChannels && (
                  <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 32 }}>
                    <DotsLoader />
                  </View>
                )}
                {!loadingChannels && errorChannels && (
                  <Text style={s.errorText}>Error: {errorChannels}</Text>
                )}
              </View>
            }
            contentContainerStyle={s.scroll}
            renderItem={renderItem}
            ListEmptyComponent={
              !loadingChannels && !errorChannels && !hasChannels ? (
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
              !loadingChannels && !errorChannels && hasChannels ? (
                <View style={{ marginTop: 100, alignItems: 'center' }}>
                  <Image
                    source={require('@/assets/images/jex/Jex-Chats-Empleador.webp')}
                    style={{ width: 250, height: 250 }}
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
