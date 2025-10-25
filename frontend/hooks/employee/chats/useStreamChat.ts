// hooks/employee/chats/useStreamChat.ts
import { useEffect, useMemo, useState } from 'react';
import { getStreamClient, getConnectedUserId } from '@/services/stream/streamClient';
import type { Channel } from 'stream-chat';
import type { ImageSourcePropType } from 'react-native';

type MinimalChannelData = {
  name?: string;           // "Foro Grupal - NombreEvento" o "NombreEvento"
  event_id?: string | number;
  kind?: string;           // opcional si el back lo setea
  [key: string]: any;
};

const AVATAR_FORO: ImageSourcePropType =
  require('@/assets/images/jex/Jex-Foro-Grupal.webp');
const AVATAR_TRAB: ImageSourcePropType =
  require('@/assets/images/jex/Jex-Chat-Trabajadores.webp');

export type UiChannelItem = {
  id: string;                 // channel cid
  // Para la UI:
  eventId: string | null;     // id del evento
  eventTitle: string | null;  // nombre del evento (limpio)
  chatTitle: string;          // "Foro Grupal" | "Trabajadores" | "Chat"
  subtitle: string;           // último mensaje o copy auxiliar
  isAnnouncements: boolean;
  isWorkers: boolean;
  lastMessageText: string | null;
  avatar: ImageSourcePropType; // 👈 avatar ya resuelto para la UI
  raw: Channel;
};

// Limpia el nombre del evento quitando el prefijo "Foro Grupal - "
export function cleanEventName(name?: string | null) {
  if (!name) return null;
  return name.replace(/^Foro\s*Grupal\s*-\s*/i, '').trim();
}

// Devuelve el título del chat según el tipo
export function chatTypeTitle(ch?: Channel | null) {
  if (!ch) return 'Chat'; // fallback seguro
  const d = (ch.data || {}) as MinimalChannelData;
  const isAnnouncements = ch.type === 'announcements' || d?.kind === 'announcements';
  const isWorkers       = ch.type === 'messaging'     || d?.kind === 'messaging';
  if (isAnnouncements) return 'Foro Grupal';
  if (isWorkers)       return 'Trabajadores';
  return 'Chat';
}

export function useStreamChannels(selectedEventId?: string) {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

  const userId = getConnectedUserId();

  const client = useMemo(() => {
    try { return getStreamClient(); } catch { return null; }
  }, []);

  useEffect(() => {
    if (!client || !userId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: Record<string, any> = {
          members: { $in: [userId] },
        };
        if (selectedEventId) {
          filters.event_id = String(selectedEventId);
          filters.$or = [{ type: 'announcements' }, { type: 'messaging' }];
        }

        const res = await client.queryChannels(
          filters,
          { last_message_at: -1 },
          { state: true, watch: true, limit: 30, presence: true }
        );
        if (!cancelled) setChannels(res);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? 'No se pudieron cargar los chats');
          setChannels([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [client, userId, selectedEventId]);

  const items: UiChannelItem[] = useMemo(() => {
    const score = (ch: Channel) =>
      ch.type === 'announcements' ? 0 : ch.type === 'messaging' ? 1 : 2;

    return [...channels]
      .sort((a, b) => score(a) - score(b))
      .map((ch) => {
        const data = (ch.data || {}) as MinimalChannelData;

        const isAnnouncements = ch.type === 'announcements' || data?.kind === 'announcements';
        const isWorkers       = ch.type === 'messaging'     || data?.kind === 'messaging';

        const eventId    = data?.event_id != null ? String(data.event_id) : null;
        const eventTitle = cleanEventName(data?.name) || null;

        const messages = ch.state?.messages || [];
        const last     = messages[messages.length - 1];
        const lastText = last?.text ? String(last.text) : null;

        const chatTitle = chatTypeTitle(ch);

        const subtitle = isAnnouncements
          ? (lastText || 'Foro del evento')
          : (lastText || 'Chat de trabajadores');

        // 👇 avatar resuelto en el hook (Metro ve ambos requires)
        const avatar = isWorkers ? AVATAR_TRAB : AVATAR_FORO;

        return {
          id: ch.cid,
          eventId,
          eventTitle,
          chatTitle,
          subtitle,
          isAnnouncements,
          isWorkers,
          lastMessageText: lastText,
          avatar,
          raw: ch,
        };
      });
  }, [channels]);

  const hasChannels = items.length > 0;
  return { loading, error, items, channels, hasChannels };
}