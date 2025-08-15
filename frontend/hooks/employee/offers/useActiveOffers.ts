import { useState, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';

type Offer = {
  salary: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  eventImage: any;
  expirationDate: string;
  expirationTime: string;
};

export const useActiveOffers = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true); // 🔹 nuevo estado de carga

  // Habilitar animaciones en Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const parseExpiration = (expDate: string, expTime: string) => {
    const [day, month] = expDate.split('/').map(Number);
    const [hour, minute] = expTime.split(':').map(Number);
    return new Date(new Date().getFullYear(), month - 1, day, hour, minute);
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
        sorted.sort((a, b) =>
          parseInt(b.salary.replace('.', '')) - parseInt(a.salary.replace('.', ''))
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
      params: {
        salary: offer.salary,
        role: offer.role,
        date: offer.date,
        startTime: offer.startTime,
        endTime: offer.endTime,
        company: offer.company,
        expirationDate: offer.expirationDate,
        expirationTime: offer.expirationTime,
        eventImage: offer.eventImage
      }
    });
  };

  useEffect(() => {
    // Simulación de fetch inicial
    setTimeout(() => {
      const initialOffers: Offer[] = [
        {
          salary: '90.000',
          role: 'Bartender',
          date: 'Viernes 23/05',
          startTime: '20:00',
          endTime: '02:00',
          company: 'Cosquin Rock',
          eventImage: require('@/assets/images/Publicidad1.png'),
          expirationDate: '20/05',
          expirationTime: '23:59'
        },
        {
          salary: '65.000',
          role: 'Mozo',
          date: 'Sábado 24/05',
          startTime: '18:00',
          endTime: '22:00',
          company: 'Ferevin',
          eventImage: require('@/assets/images/Publicidad2.png'),
          expirationDate: '21/05',
          expirationTime: '23:59'
        },
        {
          salary: '80.000',
          role: 'Seguridad',
          date: 'Domingo 25/05',
          startTime: '19:00',
          endTime: '01:00',
          company: 'LollaPalooza',
          eventImage: require('@/assets/images/Publicidad3.png'),
          expirationDate: '22/05',
          expirationTime: '23:59'
        },
        {
          salary: '75.000',
          role: 'Cocinero',
          date: 'Lunes 26/05',
          startTime: '17:00',
          endTime: '23:00',
          company: 'Festival de Jazz',
          eventImage: require('@/assets/images/Publicidad1.png'),
          expirationDate: '23/05',
          expirationTime: '23:59'
        }
      ];
      setOffers(initialOffers);
      sortOffers('date');
      setLoadingOffers(false); // 🔹 carga terminada
    }, 1000); // 1 segundo simulado de carga
  }, []);

  return { offers, sortOffers, goToOfferDetail, loadingOffers }; // 🔹 retornamos loadingOffers
};
