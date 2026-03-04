// src/hooks/employer/profile/events-history/useEmployerEventsHistory.ts
import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type EmployerEventHistoryItem = {
  id: string;
  name: string;
  description: string;
  eventImageUrl: string | null;
};

export const useEmployerEventsHistory = () => {
  const { requestBackend } = useBackendConection();

  const [items, setItems] = useState<EmployerEventHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        type APIEvent = {
          id: number;
          name: string;
          description: string;
          event_image: string | null;
        };

        const res: APIEvent[] = await requestBackend(
          "/api/events/history-events/",
          null,
          "GET"
        );

        if (!mounted) return;

        const mapped: EmployerEventHistoryItem[] = (res ?? []).map((e) => ({
          id: String(e.id),
          name: e.name,
          description: e.description,
          eventImageUrl: e.event_image ?? null,
        }));

        setItems(mapped);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Error al cargar el historial de eventos.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    items,
    loading,
    error,
  };
};
