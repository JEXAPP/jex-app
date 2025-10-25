// app/employee/chats/threads.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StreamChat as StreamChatType } from 'stream-chat';
import {
  OverlayProvider,
  Chat as StreamChatUI,
  Channel as StreamChannelUI,
  MessageList,
  MessageInput,
  TypingIndicator,
  ScrollToBottomButton,
} from 'stream-chat-expo';
import { getStreamClient } from '@/services/stream/streamClient';
import { threadStyles as s } from '@/styles/app/employer/chats/threadStyles';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { chatTypeTitle, cleanEventName } from '@/hooks/employee/chats/useStreamChat';

function parseCid(cid: string) {
  const i = cid.indexOf(':');
  return i === -1 ? { type: '', id: '' } : { type: cid.slice(0, i), id: cid.slice(i + 1) };
}

export default function EmployeeThreadScreen() {
  const { cid: cidParam } = useLocalSearchParams<{ cid?: string }>();
  const cid = cidParam ?? '';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo<StreamChatType | null>(() => {
    try {
      return getStreamClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!client || !cid) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { type, id } = parseCid(cid);
        if (!type || !id) throw new Error('Canal inválido');

        const ch = client.channel(type, id);
        await ch.watch({ state: true });
        if (!cancelled) setChannel(ch);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudo cargar el chat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [client, cid]);

  if (!client) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>No se pudo inicializar el chat.</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!cid) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>Canal no especificado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const headerTitle = chatTypeTitle(channel);
  const isWorkers =
    channel?.type === 'messaging' || channel?.data?.kind === 'messaging';

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <OverlayProvider>
        <StreamChatUI client={client}>
          {loading && (
            <View style={{ padding: 16 }}>
              <Text>Cargando chat…</Text>
            </View>
          )}

          {!loading && error && (
            <View style={{ padding: 16 }}>
              <Text style={{ color: 'red' }}>Error: {error}</Text>
            </View>
          )}

          {!loading && !error && channel && (
            <StreamChannelUI channel={channel}>
              <>
                <View style={s.header}>
                  <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
                    <Ionicons name="chevron-back-outline" size={26} color={Colors.violet4} />
                  </TouchableOpacity>

                  <View style={s.headerAvatar}>
                    <Image
                      source={require('@/assets/images/jex/Jex-Foro-Grupal.webp')}
                      style={s.avatarImg}
                    />
                  </View>

                  <View style={s.headerTitleWrap}>
                    <Text style={s.headerTitle}>{headerTitle}</Text>
                  </View>
                </View>

                {isWorkers ? (
                  <View style={{ flex: 1 }}>
                  <MessageList
                    TypingIndicator={TypingIndicator}
                    ScrollToBottomButton={ScrollToBottomButton}
                  />
                </View>
                ) : 
                <View style={{ flex: 1 }}>
                  <MessageList
                    TypingIndicator={TypingIndicator}
                    ScrollToBottomButton={ScrollToBottomButton}
                    inverted={false}
                  />
                </View>
                }

                {isWorkers ? (
                  <View  style={s.inputContainer}>
                    <MessageInput 
                   />
                  </View>
                ) : null}
              </>
            </StreamChannelUI>
          )}
        </StreamChatUI>
      </OverlayProvider>
    </SafeAreaView>
  );
}
