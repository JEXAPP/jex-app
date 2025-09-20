// hooks/employee/offers/useHomeOffers.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';
import { Offer } from '@/constants/interfaces';

type OrderKey = 'role' | 'expiration' | 'salary';
type OrderDir = 'asc' | 'desc';

export const useHomeOffers = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  const parseExpirationMs = (expDate: string, expTime: string) => {
    const [d, m, y] = String(expDate ?? '').split('/').map(Number);
    const [hh, mm] = String(expTime ?? '').split(':').map(Number);
    return new Date(y ?? new Date().getFullYear(), (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0).getTime();
  };

  const salaryToNumber = (s: string) => {
    const n = parseInt(String(s ?? '').replace(/\./g, '').replace(/[^\d]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  };

  const formatNumberAR = (v: string | number) => {
    const n = Number(v);
    return isNaN(n) ? String(v) : new Intl.NumberFormat('es-AR').format(n);
  };

  const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

  const sortOffers = (key: OrderKey, dir: OrderDir) => {
    setOffers(prev => {
      const sorted = [...prev];
      if (key === 'expiration') {
        sorted.sort(
          (a, b) =>
            parseExpirationMs(a.expirationDate, a.expirationTime) -
            parseExpirationMs(b.expirationDate, b.expirationTime)
        );
      } else if (key === 'salary') {
        sorted.sort((a, b) => salaryToNumber(a.salary) - salaryToNumber(b.salary));
      } else if (key === 'role') {
        sorted.sort((a, b) => a.role.localeCompare(b.role));
      }
      if (dir === 'desc') sorted.reverse();
      return sorted;
    });
  };

  const goToOfferDetail = (offer: Offer) => {
    router.push({ pathname: '/employee/offers/detail', params: { ...offer } });
  };

  useEffect(() => {
    let mounted = true;
    const fetchOffers = async () => {
      setLoadingOffers(true);
      try {
        const data = await requestBackend('/api/applications/offers/consult/', null, 'GET');
        if (!mounted) return;

        // Normalización sin cambiar nombres de atributos de Offer
        const normalized: Offer[] = (data ?? []).map((item: any) => {
          const shift = item?.application?.shift;
          const vacancy = shift?.vacancy;

          // 👇 calcular vencimiento a partir de fecha de inicio
          let expirationDate = "";
          if (shift?.start_date) {
            const [d, m, y] = shift.start_date.split("/").map(Number);
            const start = new Date(y, m - 1, d);
            start.setDate(start.getDate() - 3); // restar 3 días
            expirationDate = formatDate(start);
          }

          return {
            id:
              item?.id ??
              `${vacancy?.event?.id ?? "noevent"}-${shift?.job_type ?? "norole"}-${shift?.start_time ?? "notime"}`,
            salary: formatNumberAR(shift?.payment ?? 0),
            role: vacancy?.job_type ?? "Sin rol",
            date: shift?.start_date ?? "",
            startTime: shift?.start_time ?? "",
            endTime: shift?.end_time ?? "",
            company: vacancy?.event?.name ?? "Evento sin nombre",
            eventImage: vacancy?.event?.image
              ? { uri: vacancy.event.image }
              : require("@/assets/images/jex/Jex-Evento-Default.png"),
            expirationDate, // 👈 usamos la calculada
            expirationTime: "00:00", // opcional fijo
            location: vacancy?.event?.location ?? "",
            requirements: item?.requirements ?? vacancy?.requirements ?? [],
            comments: item?.comments ?? "",
          };
        });

        setOffers(normalized);
        sortOffers('expiration', 'asc'); // por defecto: vencimiento más temprano
      } catch (e) {
        console.log('Error al traer ofertas activas:', e);
      } finally {
        if (mounted) setLoadingOffers(false);
      }
    };

    fetchOffers();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOrderSelect = (order: number) => {
      switch (order) {
        case 1: return sortOffers('role', 'asc');
        case 2: return sortOffers('role', 'desc');
        case 3: return sortOffers('expiration', 'asc');
        case 4: return sortOffers('expiration', 'desc');
        case 5: return sortOffers('salary', 'asc');
        case 6: return sortOffers('salary', 'desc');
        default: return sortOffers('expiration', 'asc');
      }
    };

  return { offers, handleOrderSelect, goToOfferDetail, loadingOffers };
};
