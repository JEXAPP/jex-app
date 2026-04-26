import { useState, useEffect } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';

export type SharedEvent = {
  id: number;
  name: string;
  state: { id: number; name: string };
  all_payed: boolean;
};

export const useSharedEventSelector = () => {
  const { requestBackend } = useBackendConection();
  const [events, setEvents] = useState<SharedEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentEvent: SharedEvent | null = events[currentEventIndex] ?? null;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await requestBackend('/api/events/by-employer/', null, 'GET');
        if (Array.isArray(data)) {
          const normalized: SharedEvent[] = data.map((e: any) => ({
            id: e.id,
            name: e.name,
            state: { id: e.state?.id ?? 0, name: e.state?.name ?? 'Publicado' },
            all_payed: Boolean(e.all_payed),
          }));
          setEvents(normalized);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return {
    events,
    currentEvent,
    currentEventIndex,
    goNext: () => {
      if (currentEventIndex < events.length - 1) setCurrentEventIndex(i => i + 1);
    },
    goPrev: () => {
      if (currentEventIndex > 0) setCurrentEventIndex(i => i - 1);
    },
    canGoNext: currentEventIndex < events.length - 1,
    canGoPrev: currentEventIndex > 0,
    loading,
  };
};
