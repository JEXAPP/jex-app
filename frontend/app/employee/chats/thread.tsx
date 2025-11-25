import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  OverlayProvider,
  Chat as StreamChatUI,
  Channel as StreamChannelUI,
  MessageList,
  MessageInput,
  TypingIndicator,
  ScrollToBottomButton,
} from 'stream-chat-expo';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { getStreamClient } from '@/services/stream/streamClient';
import { threadStyles as s } from '@/styles/app/employer/chats/threadStyles';
import { DateSeparator as JexDateSeparator } from '@/components/chats/DateSeparator';
import { DotsLoader } from '@/components/others/DotsLoader';

function parseCid(cid: string) {
  const i = cid.indexOf(':');
  return i === -1 ? { type: '', id: '' } : { type: cid.slice(0, i), id: cid.slice(i + 1) };
}

const JexMessageList = (props: any) => <MessageList {...props} />;

export default function ThreadScreen() {
  const { cid: cidParam } = useLocalSearchParams<{ cid?: string }>();
  const cid = cidParam ?? '';
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [channel, setChannel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const client = useMemo(() => {
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

  if (!client) return <Text>No se pudo inicializar el chat.</Text>;
  if (!cid) return <Text>Canal no especificado.</Text>;

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right', 'bottom']}>
      <OverlayProvider>
        <StreamChatUI client={client}>
          {loading && <DotsLoader/>}
          {!loading && error && <Text style={{ color: 'red', padding: 16 }}>{error}</Text>}
          {!loading && !error && channel && (
            <StreamChannelUI channel={channel}>
              <>
                <View style={s.header}>
                  <TouchableOpacity onPress={() => router.push('/employee/chats')} style={s.backButton}>
                    <Ionicons name="chevron-back-outline" size={26} color={Colors.violet4} />
                  </TouchableOpacity>
                  <View style={s.headerAvatar}>
                    <Image
                      source={require('@/assets/images/jex/Jex-Foro-Grupal.webp')}
                      style={{ width: 28, height: 28, resizeMode: 'contain' }}
                    />
                  </View>
                  <View style={s.headerTitleWrap}>
                    <Text style={s.headerTitle}>Foro Grupal</Text>
                    <Text style={s.headerSubtitle}>Anunciá lo que quieras a tus empleados.</Text>
                  </View>
                </View>

                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={insets.bottom + 90}
                >
                  <View style={{ flex: 1 }}>
                    <JexMessageList
                      TypingIndicator={TypingIndicator}
                      ScrollToBottomButton={ScrollToBottomButton}
                      inverted={true}
                      DateSeparator={CustomDateSeparator}
                    />
                  </View>

                  <View style={[s.inputContainer, { paddingBottom: insets.bottom }]}>
                    <MessageInput />
                  </View>
                </KeyboardAvoidingView>
              </>
            </StreamChannelUI>
          )}
        </StreamChatUI>
      </OverlayProvider>
    </SafeAreaView>
  );
}
