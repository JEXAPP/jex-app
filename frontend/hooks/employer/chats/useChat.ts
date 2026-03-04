import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

export type ChatEvent = {
  id: string;
  name: string;
  status?: string;
};

type Option = { id: string; title: string };

const VALID_STATES = ['Publicado', 'En ejecución'];

export function useChat() {
  const { requestBackend } = useBackendConection();

  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRef = useRef(requestBackend);
  useEffect(() => { requestRef.current = requestBackend; }, [requestBackend]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await requestRef.current('/api/events/by-employer/', null, 'GET');
      const list: any[] = Array.isArray(resp) ? resp : resp?.results ?? [];

      const normalized: ChatEvent[] = list.map((e) => ({
        id: String(e?.id ?? e?.event_id ?? e?.uuid),
        name: String(e?.name ?? e?.nombre ?? 'Sin nombre'),
        status: e?.state?.name ?? e?.estado ?? e?.status,
      }));

      const filtered = normalized.filter(e =>
        VALID_STATES.includes(String(e.status))
      );

      const unique = Array.from(new Map(filtered.map(ev => [ev.id, ev])).values());

      unique.sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      );

      setEvents(unique);

      setSelectedEventId(prev =>
        (prev && unique.some(u => u.id === prev))
          ? prev
          : (unique[0]?.id ?? null)
      );

    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar los eventos');
      setEvents([]);
      setSelectedEventId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const selectEvent = useCallback((id: string) => {
    setSelectedEventId(id);
  }, []);

  const options: Option[] = useMemo(
    () => events.map(e => ({ id: e.id, title: e.name })),
    [events]
  );

  const refresh = useCallback(() => fetchEvents(), [fetchEvents]);

  return {
    loading,
    error,
    refresh,
    options,
    selectedEventId,
    selectEvent,
  };
}