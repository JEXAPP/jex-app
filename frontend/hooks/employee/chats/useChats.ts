// hooks/employee/chats/useChats.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStreamChannels } from '@/hooks/employee/chats/useStreamChat';

type Option = { id: string; title: string };

export function useChat() {
  const { loading, error, items: allItems } = useStreamChannels(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Opciones por evento
  const options: Option[] = useMemo(() => {
    const byEvent = new Map<string, string>();
    for (const it of allItems) {
      if (!it.eventId) continue;
      const title = it.eventTitle || 'Evento';
      if (!byEvent.has(it.eventId)) byEvent.set(it.eventId, title);
    }
    return Array.from(byEvent.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  }, [allItems]);

  // Selección inicial
  useEffect(() => {
    if (!selectedEventId && options.length > 0) {
      setSelectedEventId(options[0].id);
    }
  }, [options, selectedEventId]);

  // Filtrado por evento + orden por tipo (anuncios → workers → demás)
  const items = useMemo(() => {
    if (!selectedEventId) return [];
    return allItems
      .filter((it) => it.eventId === selectedEventId)
      .sort((a, b) => {
        const s = (x: typeof a) => (x.isAnnouncements ? 0 : x.isWorkers ? 1 : 2);
        return s(a) - s(b);
      });
  }, [allItems, selectedEventId]);

  const hasChannels = items.length > 0;
  const selectEvent = useCallback((id: string) => setSelectedEventId(id), []);

  return {
    loading,
    error,
    options,
    selectedEventId,
    selectEvent,
    items,       // UiChannelItem[] -> item.id ya es el CID correcto
    hasChannels,
  };
}
