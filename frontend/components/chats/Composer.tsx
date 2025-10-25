// components/chats/Composer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
type MinimalChannel = {
  sendMessage: (message: any) => Promise<any>;
  sendImage: (file: any) => Promise<{ file?: string } | any>;
  sendFile: (file: any) => Promise<{ file?: string } | any>;
};

type Props = { channel: MinimalChannel | null };

const VIOLET = '#511F73';
const GRAY1 = '#F3F3F3';
const BORDER = '#E7DAF1';

export function Composer({ channel }: Props) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordMillis, setRecordMillis] = useState(0);
  const [recordUri, setRecordUri] = useState<string | null>(null);
  const intervalRef = useRef<any>(null);

  const canSendText = text.trim().length > 0;
  const hasAudioReady = !!recordUri;

  // ---------- Enviar texto ----------
  const onSendText = async () => {
    const t = text.trim();
    if (!t || !channel) return;
    await channel.sendMessage({ text: t });
    setText('');
  };

  // ---------- Imagen ----------
  const pickAndSendImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted' || !channel) return;

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        selectionLimit: 1,
        quality: 0.9,
      });
      if (res.canceled || !res.assets?.length) return;

      const asset = res.assets[0];
      const file: any = {
        uri: asset.uri,
        name: asset.fileName ?? 'image.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      };
      const uploaded = await channel.sendImage(file);
      const image_url = uploaded?.file ?? asset.uri;

      await channel.sendMessage({
        attachments: [{ type: 'image', image_url }],
      });
    } catch {}
  };

  // ---------- Audio estilo WhatsApp ----------
  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const startRecording = async () => {
    try {
      if (!channel) return;
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const rec = new Audio.Recording();
      // Expo SDK 51+: usar RecordingOptionsPresets
      const options =
        (Audio as any).RecordingOptionsPresets?.HIGH_QUALITY ?? {
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
        };

      await rec.prepareToRecordAsync(options);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      setRecordMillis(0);
      setRecordUri(null);

      intervalRef.current = setInterval(async () => {
        const status = await rec.getStatusAsync();
        if (status.isRecording) setRecordMillis(status.durationMillis ?? 0);
      }, 150);
    } catch {
      stopRecording(true);
    }
  };

  const stopRecording = async (cancel = false) => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (!recording) {
        setIsRecording(false);
        return;
      }
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI() || null;
      setRecording(null);
      setIsRecording(false);

      if (cancel) {
        setRecordUri(null);
        setRecordMillis(0);
        return;
      }
      // Guardamos el uri hasta que se envíe correctamente
      setRecordUri(uri);
    } catch {
      setRecording(null);
      setIsRecording(false);
      setRecordUri(null);
    }
  };

  const cancelAudio = () => stopRecording(true);

  const sendAudio = async () => {
    try {
      if (!recordUri || !channel) return;

      // Subimos el archivo y lo adjuntamos como audio
      const file: any = {
        uri: recordUri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      };
      const uploaded = await channel.sendFile(file);
      const asset_url = uploaded?.file ?? recordUri;

      await channel.sendMessage({
        attachments: [{ type: 'audio', asset_url, mime_type: 'audio/m4a', title: 'Audio' }],
      });

      // Limpiamos solo si se envió OK
      setRecordUri(null);
      setRecordMillis(0);
    } catch {
      // si falla, conservamos el recordUri para reintentar
    }
  };

  // ---------- UI ----------
  const CircleBtn = ({
    onPress,
    icon,
    size = 24,
  }: {
    onPress?: () => void;
    icon: React.ReactNode;
    size?: number;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: VIOLET,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // sin fondo
      }}
    >
      {icon}
    </Pressable>
  );

  return (
    <View style={{ backgroundColor: GRAY1, padding: 8, paddingBottom: 10 }}>
      {isRecording ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CircleBtn
            onPress={cancelAudio}
            icon={<Ionicons name="trash-outline" size={24} color={VIOLET} />}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: BORDER,
              paddingHorizontal: 12,
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: VIOLET, fontWeight: '600' }}>
              Grabando… {fmt(recordMillis)}
            </Text>
            <Ionicons name="mic" size={18} color={VIOLET} />
          </View>
          <CircleBtn
            onPress={() => stopRecording(false)}
            icon={<Ionicons name="stop-outline" size={24} color={VIOLET} />}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CircleBtn
            onPress={pickAndSendImage}
            icon={<Ionicons name="image-outline" size={24} color={VIOLET} />}
          />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribí tu mensaje…"
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF', // input blanco
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: Platform.OS === 'ios' ? 14 : 10,
              color: '#1F1F1F',
              borderWidth: 1,
              borderColor: BORDER,
            }}
            placeholderTextColor="#8A7799"
          />
          {hasAudioReady ? (
            <CircleBtn
              onPress={sendAudio}
              icon={<Ionicons name="paper-plane-outline" size={24} color={VIOLET} />}
            />
          ) : text.trim().length > 0 ? (
            <CircleBtn
              onPress={onSendText}
              icon={<Ionicons name="paper-plane-outline" size={24} color={VIOLET} />}
            />
          ) : (
            <CircleBtn
              onPress={startRecording}
              icon={<Ionicons name="mic-outline" size={24} color={VIOLET} />}
            />
          )}
        </View>
      )}
    </View>
  );
}
