import { useEffect, useState } from "react";
import useBackendConection from "@/services/internal/useBackendConection";

export type WorkHistoryItem = {
  id: string;

  eventName: string;
  eventLogoUrl?: string | null;
  eventDate: string;     // dd/mm/aaaa

  roleName: string;
  amount: number;
  currency: string;      // ARS

  doneAt: string | null; // dd/mm/aaaa o null (fecha de pago)
  
  organizerName: string;
  organizerImageUrl?: string | null;

  ratingScore: number;
  ratingComment: string;
};

const parseDDMMYYYY = (str: string | null): Date => {
  if (!str) return new Date(0); // para ordenar al final
  const [dd, mm, yyyy] = str.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

export const useWorkHistory = () => {
  const { requestBackend } = useBackendConection();

  const [items, setItems] = useState<WorkHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const data = await requestBackend(
          "/api/applications/employee-jobs-history/",
          null,
          "GET"
        );

        if (!Array.isArray(data)) {
          setItems([]);
          return;
        }

        const mapped: WorkHistoryItem[] = data.map((raw: any, i: number) => ({
          id: `${raw.event_id}-${i}`,
          eventName: raw.event_name ?? "Evento",
          eventLogoUrl: raw.event_image_url ?? null,
          eventDate: raw.start_date ?? "", // dd/mm/aaaa

          roleName: raw.job_type ?? "",
          amount: Number(raw.payment_amount ?? 0),
          currency: "ARS",

          doneAt: raw.payment_date ?? null, // dd/mm/aaaa o null

          organizerName: raw.company_name ?? "Organizador",
          organizerImageUrl: raw.employer_image_url ?? null,

          ratingScore:
            raw.stars !== null && raw.stars !== undefined
              ? Number(raw.stars)
              : 0,
          ratingComment: raw.comment ?? "",
        }));

        // Ordenar por fecha de pago (doneAt) o fecha del evento si no hay pago
        const ordered = [...mapped].sort((a, b) => {
          const da = parseDDMMYYYY(a.doneAt || a.eventDate);
          const db = parseDDMMYYYY(b.doneAt || b.eventDate);
          return db.getTime() - da.getTime();
        });

        setItems(ordered);
      } catch (err) {
        console.warn("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return {
    items,
    loading,
  };
};
