// hooks/employee/chats/useChats.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStreamChannels } from '@/hooks/employee/chats/useStreamChat';

type Option = { id: string; title: string }; // para el dropdown (label/value se mapea en la screen)

export function useChat() {
  const { loading, error, items } = useStreamChannels(undefined);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Opciones por evento (nombre limpio)
  const options: Option[] = useMemo(() => {
    const byEvent = new Map<string, string>(); // id -> title
    for (const it of items) {
      if (!it.eventId) continue;
      const title = it.eventTitle || it.eventTitle || 'Evento';
      if (!byEvent.has(it.eventId)) byEvent.set(it.eventId, title);
    }
    return Array.from(byEvent.entries())
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  }, [items]);

  // Selección inicial
  useEffect(() => {
    if (!selectedEventId && options.length > 0) {
      setSelectedEventId(options[0].id);
    }
  }, [options, selectedEventId]);

  // Filtrado por evento
  const itemsFiltered = useMemo(() => {
    if (!selectedEventId) return [];
    return items
      .filter((it) => it.eventId === selectedEventId)
      .sort((a, b) => {
        const s = (x: typeof a) => (x.isAnnouncements ? 0 : x.isWorkers ? 1 : 2);
        return s(a) - s(b);
      });
  }, [items, selectedEventId]);

  const hasChannels = itemsFiltered.length > 0;
  const selectEvent = useCallback((id: string) => setSelectedEventId(id), []);

  return {
    loading,
    error,
    options,              // para el dropdown
    selectedEventId,
    selectEvent,
    items: itemsFiltered, // listos para pintar
    hasChannels,
  };
}
