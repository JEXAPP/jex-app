import { useCallback, useEffect, useMemo, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

export type GlobalEvent = {
  id: number;
  name: string;
  state: { id: number; name: string };
  all_payed: boolean;
};

export function useGlobalEventSelector() {
  const { requestBackend } = useBackendConection();
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requestBackend('/api/events/by-employer/', null, 'GET');
      if (!Array.isArray(data)) return;
      const mapped: GlobalEvent[] = data.map((e: any) => ({
        id: e.id,
        name: e.name ?? '',
        state: { id: e.state?.id ?? 0, name: e.state?.name ?? '' },
        all_payed: Boolean(e.all_payed),
      }));
      setEvents(mapped);
      setCurrentEventId(prev => {
        if (prev !== null && mapped.some(e => e.id === prev)) return prev;
        const firstActive = mapped.find(e => e.state.name !== 'Finalizado');
        return firstActive?.id ?? null;
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const currentEvent = useMemo(
    () => events.find(e => e.id === currentEventId) ?? null,
    [events, currentEventId],
  );

  const setCurrentEvent = useCallback((id: number) => setCurrentEventId(id), []);

  return { events, currentEvent, setCurrentEvent, loading, refresh: fetchEvents };
}
