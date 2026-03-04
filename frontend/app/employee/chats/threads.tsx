import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { StreamChat as StreamChatType } from 'stream-chat';
import {
  OverlayProvider,
  Chat as StreamChatUI,
  Channel as StreamChannelUI,
  MessageList,
  MessageInput,
  TypingIndicator,
  ScrollToBottomButton
} from 'stream-chat-expo';

import { getStreamClient } from '@/services/stream/streamClient';
import { threadStyles as s } from '@/styles/app/employee/chats/threadStyles';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { chatTypeTitle } from '@/hooks/employee/chats/useStreamChat';
import { DateSeparator as JexDateSeparator } from '@/components/chats/DateSeparator';
import { DotsLoader } from '@/components/others/DotsLoader';

function parseCid(cid: string) {
  const i = cid.indexOf(':');
  return i === -1 ? { type: '', id: '' } : { type: cid.slice(0, i), id: cid.slice(i + 1) };
}

const JexMessageList = (props: any) => <MessageList {...props} />;

export default function EmployeeThreadScreen() {
  const { cid: cidParam } = useLocalSearchParams<{ cid?: string }>();
  const cid = cidParam ?? '';
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

    return () => {
      cancelled = true;
    };
  }, [client, cid]);

  const CustomDateSeparator = (props: any) => (
    <JexDateSeparator date={props?.date} />
  );

  if (!client) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>No se pudo inicializar el chat.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cid) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
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
    <SafeAreaView style={s.container} edges={['bottom', 'left', 'right']}>
      <OverlayProvider 
        value={{
        style: {
          inlineDateSeparator: {
            container: {
              backgroundColor: Colors.violet4,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 20
            },
            text: {
              color: 'white',
              fontFamily: 'interLightItalic',
              fontSize: 11,
            },
          },
        },
      }}>
        <StreamChatUI client={client as any}>
          {loading && (
            <DotsLoader/>
          )}

          {!loading && error && (
            <Text style={{ padding: 16, color: 'red' }}>Error: {error}</Text>
          )}

          {!loading && !error && channel && (
             <StreamChannelUI
                channel={channel}
                hideStickyDateHeader={true}
                
              >
                <>
                  {/* HEADER */}
                  <View style={s.header}>
                    <TouchableOpacity onPress={() => router.push('/employee/chats')} style={s.backButton}>
                      <Ionicons name="chevron-back-outline" size={26} color={Colors.white} />
                    </TouchableOpacity>

                    <View style={s.headerAvatar}>
                      <Image
                        source={require('@/assets/images/jex/Jex-Evento-Default.webp')}
                        style={s.avatarImg}
                      />
                    </View>

                    <View style={s.headerTitleWrap}>
                      <Text style={s.headerTitle}>{headerTitle}</Text>
                    </View>
                  </View>

                {/* CUERPO DEL CHAT */}
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  // similar a employer ThreadScreen
                  keyboardVerticalOffset={10} 
                >
                  <View style={{ flex: 1 }}>
                    <JexMessageList
                      TypingIndicator={TypingIndicator}
                      ScrollToBottomButton={ScrollToBottomButton}
                      inverted={true}   // Foro invertido, workers normal
                      DateSeparator={CustomDateSeparator}
                      
                    />
                  </View>

                  {isWorkers && (
                    <View style={[s.inputContainer]}>
                      <MessageInput additionalTextInputProps={{
                        placeholder: 'Escribí un mensaje...',
                      }}/>
                    </View>
                  )}
                </KeyboardAvoidingView>
              </>
            </StreamChannelUI>
          )}
        </StreamChatUI>
      </OverlayProvider>
    </SafeAreaView>
  );
}
