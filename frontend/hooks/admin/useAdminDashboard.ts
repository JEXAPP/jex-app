import { useEffect, useMemo, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { disconnectStream } from '@/services/stream/streamClient';
import * as SecureStore from 'expo-secure-store';
import { clearTokens } from '@/services/internal/api';
import { router } from 'expo-router';

export type ComplaintStatus = 'En Revisión' | 'Aceptada' | 'Rechazada';

export interface Complaint {
  id: number;
  reporter_name: string;
  reported_name: string;
  reason: string;
  status: ComplaintStatus;

  created_at: string;
  created_time?: string;

  penalized_phone?: string;
  penalized_email?: string;

  event_name?: string;
  event_image?: string;

  comments?: string;

  close_date?: string | null;
  close_time?: string | null;
  state_comment?: string | null;
}

interface RawPenalty {
  id: number;
  penalized_user: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  punisher: number;
  event_info: {
    name: string;
    image: string;
  };
  comments: string;

  penalty_state: ComplaintStatus;
  penalty_type: string;
  penalty_date: string;
  penalty_time: string;

  close_date?: string | null;
  close_time?: string | null;
  state_comment?: string | null;
}

export const useAdminDashboard = () => {
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<ComplaintStatus>('En Revisión');

  useEffect(() => {
    const fetchAdminInfo = async () => {
      setLoading(true);
      try {
        const data = await requestBackend('/api/auth/admin/info', null, 'GET');

        const list: RawPenalty[] = Array.isArray(data)
          ? data
          : data?.complaints || [];

        const normalized: Complaint[] = list.map(p => {
          const penalized = p.penalized_user || ({} as any);
          const eventInfo = p.event_info || ({} as any);

          const fullName =
            `${penalized.first_name || ''} ${penalized.last_name || ''}`.trim() ||
            penalized.email ||
            'Sin nombre';

          return {
            id: p.id,
            reporter_name: `Organizador #${p.punisher}`,
            reported_name: fullName,
            reason: p.penalty_type,
            status: p.penalty_state,

            created_at: p.penalty_date,
            created_time: p.penalty_time,

            penalized_phone: penalized.phone,
            penalized_email: penalized.email,

            event_name: eventInfo?.name,
            event_image: eventInfo?.image,

            comments: p.comments,

            close_date: p.close_date ?? null,
            close_time: p.close_time ?? null,
            state_comment: p.state_comment ?? null,
          };
        });

        setComplaints(normalized);
      } catch (e) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const counts = useMemo(() => {
    const base = {
      'En Revisión': 0,
      'Aceptada': 0,
      'Rechazada': 0,
    };

    complaints.forEach(c => {
      base[c.status] += 1;
    });

    return base;
  }, [complaints]);

  const totalComplaints = complaints.length;
  const pendingComplaints = counts['En Revisión'];
  const resolvedComplaints =
    counts['Aceptada'] + counts['Rechazada'];

  const pieStatusData = [
    { value: counts['En Revisión'], label: 'En Revisión' },
    { value: counts['Aceptada'], label: 'Aceptada' },
    { value: counts['Rechazada'], label: 'Rechazada' },
  ];

  const filteredComplaints = complaints.filter(
    c => c.status === selectedStatusFilter
  );

  const availableStatusFilters: ComplaintStatus[] = [
    'En Revisión',
    'Aceptada',
    'Rechazada',
  ];

  const resolvePenalty = async (
    id: number,
    nextStateId: 2 | 3,
    comment: string
  ) => {
    const res = await requestBackend(
      `/api/rating/penalty/update-state/${id}/`,
      { state_id: nextStateId, comment },
      'PATCH'
    );

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;

        return {
          ...c,
          status: nextStateId === 3 ? 'Aceptada' : 'Rechazada',
          state_comment: res?.state_comment ?? comment,
          close_date: res?.close_date ?? c.close_date,
          close_time: res?.close_time ?? c.close_time,
        };
      })
    );
  };

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync("refresh");

      if (refresh) {
        try {
          await requestBackend("/api/auth/logout/", { refresh }, "POST");
          console.log("Sesión cerrada en backend");
        } catch (e) {
          console.warn("Logout backend falló, pero seguimos:", e);
        }
      }

      try {
        await disconnectStream();
      } catch (e) {
        console.warn("Error al desconectar Stream:", e);
      }

    } finally {
      await clearTokens();
      router.replace("/");
    }
  };

  return {
    loading,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    pieStatusData,
    filteredComplaints,
    selectedStatusFilter,
    setSelectedStatusFilter,
    availableStatusFilters,
    resolvePenalty,
    handleLogout,
  };
};