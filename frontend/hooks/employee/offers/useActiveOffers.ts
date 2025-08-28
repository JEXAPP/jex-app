// hooks/employee/offers/useActiveOffers.ts
import { useState, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

// Tipado local que consume la pantalla
type Offer = {
  id: number;
  salary: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  eventImage: any; // si luego lo recibís desde el back podés cambiar esto
  expirationDate: string;
  expirationTime: string;
  location: string;
  requirements: string[];
  comments: string;
};

export const useActiveOffers = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  // habilitar animaciones en Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // 🔹 helper para dar formato a los pagos (20.000, 200.000)
  const formatNumber = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('es-AR').format(num);
  };

  const parseExpiration = (expDate: string, expTime: string) => {
    const [day, month, year] = expDate.split('/').map(Number);
    const [hour, minute] = expTime.split(':').map(Number);
    return new Date(year ?? new Date().getFullYear(), (month ?? 1) - 1, day ?? 1, hour ?? 0, minute ?? 0);
  };

  const sortOffers = (criteria: 'date' | 'salary' | 'name') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setOffers(prevOffers => {
      const sorted = [...prevOffers];
      if (criteria === 'date') {
        sorted.sort((a, b) =>
          parseExpiration(a.expirationDate, a.expirationTime).getTime() -
          parseExpiration(b.expirationDate, b.expirationTime).getTime()
        );
      } else if (criteria === 'salary') {
        // 💡 como salary ya viene formateado ("20.000"), saco puntos antes de parsear
        sorted.sort((a, b) =>
          parseInt(b.salary.replace(/\./g, '')) - parseInt(a.salary.replace(/\./g, ''))
        );
      } else if (criteria === 'name') {
        sorted.sort((a, b) => a.role.localeCompare(b.role));
      }
      return sorted;
    });
  };

  const goToOfferDetail = (offer: Offer) => {
    router.push({
      pathname: '/employee/offers/offers-detail',
      params: { ...offer }
    });
  };

  useEffect(() => {
    let mounted = true;
    const fetchOffers = async () => {
      setLoadingOffers(true);
      try {
        const data = await requestBackend('/api/applications/offers/consult/', null, 'GET');
        if (!mounted) return;

        console.log('🔹 Respuesta cruda del backend:', JSON.stringify(data, null, 2));

        const mappedOffers: Offer[] = data.map((item: any) => {
          const shift = item.application?.shift;
          const vacancy = shift?.vacancy;

          return {
            id: item.id,
            salary: formatNumber(shift?.payment || 0), // 👈 formateo acá
            role: vacancy?.job_type?.name || 'Sin rol',
            date: shift?.start_date || '',
            startTime: shift?.start_time || '',
            endTime: shift?.end_time || '',
            company: vacancy?.event?.name || 'Evento sin nombre',
            eventImage: require('@/assets/images/jex/Jex-Evento-Default.png'), // 👈 imagen por defecto
            expirationDate: item.expiration_date || '',
            expirationTime: item.expiration_time || '',
          };
        });

        console.log('✅ Offers mapeadas:', mappedOffers);

        setOffers(mappedOffers);
        sortOffers('date');
      } catch (e) {
        console.log('❌ Error al traer ofertas activas:', e);
      } finally {
        if (mounted) setLoadingOffers(false);
      }
    };

    fetchOffers();
    return () => {
      mounted = false;
    };
  }, []);

  return { offers, sortOffers, goToOfferDetail, loadingOffers };
};
