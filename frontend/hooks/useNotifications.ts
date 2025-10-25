import useBackendConection from '@/services/internal/useBackendConection';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

export type NotificationTypeDTO = { id: number; name: string };
export type NotificationDTO = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  notification_type: NotificationTypeDTO;
  created_at: string;        // "DD/MM/YYYY HH:mm"
  image_url?: string | null;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function parseBackendDate(s: string): Date {
  const [dpart, tpart] = s.split(' ');
  const [dd, mm, yyyy] = dpart.split('/').map(Number);
  const [HH, MM] = (tpart ?? '00:00').split(':').map(Number);
  return new Date(yyyy, mm - 1, dd, HH, MM, 0, 0);
}
function isToday(d: Date) {
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}
export function formatNotificationDate(created_at: string) {
  const d = parseBackendDate(created_at);
  if (isToday(d)) {
    const hh = `${d.getHours()}`.padStart(2, '0');
    const mm = `${d.getMinutes()}`.padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]}, ${d.getFullYear()}`;
}

const dedupeById = (arr: NotificationDTO[]) => {
  const seen = new Set<number>();
  return arr.filter(n => (seen.has(n.id) ? false : (seen.add(n.id), true)));
};

export const useNotifications = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const mounted = useRef(false);

  const unreadCount = useMemo(() => items.filter(n => !n.read).length, [items]);

  const fetchNotifications = async (reset = false) => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const currentPage = reset ? 1 : page;

      const data = await requestBackend( `/api/notifications/?page=${currentPage}&page_size=10`, null, 'GET') as Paginated<NotificationDTO> | undefined;

      const results: NotificationDTO[] = data?.results ?? [];
      const count: number = data?.count ?? 0;

      if (reset) {
        const base = dedupeById(results);
        setItems(base);
        setPage(2);
        setHasMore(base.length < count);
      } else {
        setItems(prev => {
          const merged = dedupeById([...prev, ...results]);
          setHasMore(merged.length < count);
          return merged;
        });
        setPage(p => p + 1);
      }
    } catch (e) {
      console.log('Error al obtener notificaciones', e);
      setHasMore(false);
      Alert.alert('Error', 'No pudimos obtener tus notificaciones.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetching && hasMore) fetchNotifications(false);
  };

  useEffect(() => {
    if (!mounted.current) mounted.current = true;
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchNotifications(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markOneRead = async (id: number) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n))); // optimista
    try {
      await requestBackend(`/api/notifications/${id}/read/`, null, 'POST');
    } catch{
      setItems(prev => prev.map(n => (n.id === id ? { ...n, read: false } : n)));
    }
  };

  const markAllRead = async () => {
    const snapshot = items;
    setItems(snapshot.map(n => ({ ...n, read: true })));
    try {
      await requestBackend('/api/notifications/mark-all-read/', null, 'POST');
    } catch {
      setItems(snapshot);
      Alert.alert('Error', 'No pudimos marcar todas como leídas.');
    }
  };

  const handlePress = async (n: NotificationDTO) => {
    if (!n.read) await markOneRead(n.id);
    // router.push(...) según n.notification_type.name si lo necesitás
  };

  return {
    items,
    isFetching,
    hasMore,
    handleLoadMore,
    fetchNotifications,
    markAllRead,
    markOneRead,
    handlePress,
    formatDate: formatNotificationDate,
    unreadCount,
  };
};
