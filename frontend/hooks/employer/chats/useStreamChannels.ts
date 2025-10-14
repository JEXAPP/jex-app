import { useEffect, useMemo, useState } from 'react';
import { getStreamClient, getConnectedUserId } from '@/services/stream/streamClient';
import type { Channel } from 'stream-chat';
import type { ImageSourcePropType } from 'react-native';

// Top-level requires para que Metro incluya los assets
const AVATAR_FORO: ImageSourcePropType =
  require('@/assets/images/jex/Jex-Foro-Grupal.png');

type MinimalChannelData = {
  name?: string;
  event_id?: string | number;
  kind?: string;
  [key: string]: any;
};

export type UiChannelItem = {
  id: string;
  // UI
  eventId: string | null;
  eventTitle: string | null;
  chatTitle: string;       // "Foro Grupal"
  subtitle: string;        // último mensaje o copy
  isAnnouncements: boolean;// siempre true en employer
  lastMessageText: string | null;
  avatar: ImageSourcePropType;
  raw: Channel;
};

// Limpia "Foro Grupal - " si llegara así desde el back
function cleanEventName(name?: string | null) {
  if (!name) return null;
  return name.replace(/^Foro\s*Grupal\s*-\s*/i, '').trim() || null;
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
        const filters: Record<string, any> = { members: { $in: [userId] } };
        if (selectedEventId) {
          filters.event_id = String(selectedEventId);
          // employer: sólo announcements
          filters.type = 'announcements';
        }

        const res = await client.queryChannels(
          filters,
          [{ last_message_at: -1 }, { updated_at: -1 }],
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
    return channels.map((ch) => {
      const data = (ch.data || {}) as MinimalChannelData;

      const isAnnouncements = true; // employer sólo usa announcements
      const eventId    = data?.event_id != null ? String(data.event_id) : null;
      const eventTitle = cleanEventName(data?.name) || null;

      const messages = ch.state?.messages || [];
      const last     = messages[messages.length - 1];
      const lastText = last?.text ? String(last.text) : null;

      const chatTitle = 'Foro Grupal';
      const subtitle  = lastText || 'Anunciá lo que quieras a tus empleados.';

      return {
        id: ch.cid,
        eventId,
        eventTitle,
        chatTitle,
        subtitle,
        isAnnouncements,
        lastMessageText: lastText,
        avatar: AVATAR_FORO,
        raw: ch,
      };
    });
  }, [channels]);

  const hasChannels = items.length > 0;
  return { loading, error, items, channels, hasChannels };
}
