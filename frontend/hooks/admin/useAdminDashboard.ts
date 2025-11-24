// hooks/admin/useAdminDashboard.ts
import { useEffect, useMemo, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { disconnectStream } from '@/services/stream/streamClient';
import * as SecureStore from 'expo-secure-store';
import { clearTokens } from '@/services/internal/api';
import { router } from 'expo-router';

export type ComplaintStatus = 'pending' | 'in_review' | 'resolved' | string;

// Lo que el render espera
export interface Complaint {
  id: number;
  reporter_name: string;   // mapeado desde punisher (por ahora como "Organizador #id")
  reported_name: string;   // nombre del penalizado
  reason: string;          // motivo (comentario o label del tipo)
  status: ComplaintStatus; // label de estado ("Pendiente", "Activa", etc.)
  created_at: string;      // fecha formateada
  context?: string;        // info adicional (ej: nombre del evento)
}

// Lo que devuelve el backend
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
  penalty_state: number; // 0,1,2...
  penalty_type: number;  // 10,11,13,15...
  penalty_date: string;  // ISO
}

interface AdminInfoResponse {
  complaints?: Complaint[];
  total_complaints?: number;
  pending_complaints?: number;
  resolved_complaints?: number;
  [k: string]: any;
}

const formatDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const mapPenaltyStateToStatus = (state?: number): ComplaintStatus => {
  switch (state) {
    case 0:
      return 'Pendiente';
    case 1:
      return 'Activa';
    case 2:
      return 'Levantada';
    default:
      return `Estado ${state ?? ''}`.trim();
  }
};

const mapPenaltyTypeToLabel = (type?: number, comments?: string): string => {
  switch (type) {
    case 10:
      return 'Llega tarde';
    case 11:
      return 'No confirma asistencia';
    case 13:
      return 'No se presenta';
    case 15:
      return 'No cumple funciones';
    default:
      return comments || `Tipo ${type ?? ''}`;
  }
};

export const useAdminDashboard = () => {
  const { requestBackend } = useBackendConection();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [rawInfo, setRawInfo] = useState<AdminInfoResponse | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  useEffect(() => {
    const fetchAdminInfo = async () => {
      setLoading(true);
      try {
        const data = (await requestBackend(
          '/api/auth/admin/info',
          null,
          'GET'
        )) as AdminInfoResponse | RawPenalty[];

        setRawInfo((data as AdminInfoResponse) || null);

        let list: RawPenalty[] = [];

        if (Array.isArray((data as any)?.complaints)) {
          list = (data as any).complaints as RawPenalty[];
        } else if (Array.isArray(data as any)) {
          list = data as RawPenalty[];
        }

        const normalized: Complaint[] = list.map(p => {
          const penalized = p.penalized_user || ({} as RawPenalty['penalized_user']);
          const eventInfo = p.event_info || ({} as RawPenalty['event_info']);

          const fullName =
            `${penalized.first_name || ''} ${penalized.last_name || ''}`.trim() ||
            penalized.email ||
            'Sin nombre';

          const statusLabel = mapPenaltyStateToStatus(p.penalty_state);
          const reasonLabel = mapPenaltyTypeToLabel(p.penalty_type, p.comments);

          return {
            id: p.id,
            reporter_name: `Organizador #${p.punisher}`,
            reported_name: fullName,
            reason: reasonLabel,
            status: statusLabel,
            created_at: formatDate(p.penalty_date),
            context: eventInfo?.name ? `Evento: ${eventInfo.name}` : undefined,
          };
        });

        setComplaints(normalized);
      } catch (e) {
        console.log('Error al cargar información de admin:', e);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of complaints) {
      const key = c.status || 'desconocido';
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [complaints]);

  const countsByReason = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of complaints) {
      const key = c.reason || 'Sin motivo';
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [complaints]);

  const totalComplaints =
    rawInfo?.total_complaints ??
    complaints.length;

  const pendingComplaints =
    rawInfo?.pending_complaints ??
    (countsByStatus['Pendiente'] || 0);

  const resolvedComplaints =
    rawInfo?.resolved_complaints ??
    (countsByStatus['Levantada'] || 0);

  const pieStatusData = useMemo(
    () =>
      Object.entries(countsByStatus).map(([status, value]) => ({
        value,
        label: status,
      })),
    [countsByStatus]
  );

  const barReasonData = useMemo(
    () =>
      Object.entries(countsByReason).map(([reason, value]) => ({
        value,
        label: reason.length > 8 ? reason.slice(0, 8) + '…' : reason,
        fullLabel: reason,
      })),
    [countsByReason]
  );

  const filteredComplaints = useMemo(() => {
    if (selectedStatusFilter === 'all') return complaints;
    return complaints.filter(c => c.status === selectedStatusFilter);
  }, [complaints, selectedStatusFilter]);

  const availableStatusFilters = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach(c => {
      if (c.status) set.add(c.status);
    });
    return Array.from(set);
  }, [complaints]);

  const debugTokens = async () => {
    const access = await SecureStore.getItemAsync('access');
    const refresh = await SecureStore.getItemAsync('refresh');
    console.log('ACCESS:', access);
    console.log('REFRESH:', refresh);
  };

  const handleLogout = async () => {
    try {
      const refresh = await SecureStore.getItemAsync('refresh');
      if (refresh) {
        await requestBackend('/api/auth/logout/', { refresh }, 'POST');
        console.log('Sesión cerrada en backend');
      }
      await disconnectStream();
    } catch (e: any) {
      console.warn('Error al cerrar sesión en backend:', e.message);
    } finally {
      await clearTokens();
      await debugTokens();
      router.replace('/');
    }
  };

  return {
    loading,
    complaints,
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    pieStatusData,
    barReasonData,
    filteredComplaints,
    selectedStatusFilter,
    setSelectedStatusFilter,
    availableStatusFilters,
    handleLogout,
  };
};
