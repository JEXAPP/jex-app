import { useState, useEffect } from 'react';

type Offer = {
  salary: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  company: string;
  eventImage: any;
  expirationDate: string; // formato DD/MM
  expirationTime: string; // HH:mm
};

export const useActiveOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([
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
  ]);

  // 🔹 Convierte DD/MM a objeto Date (año actual)
  const parseExpiration = (expDate: string, expTime: string) => {
    const [day, month] = expDate.split('/').map(Number);
    const [hour, minute] = expTime.split(':').map(Number);
    return new Date(new Date().getFullYear(), month - 1, day, hour, minute);
  };

  // 🔹 Ordena por criterio
  const sortOffers = (criteria: 'date' | 'salary' | 'name') => {
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

  // 🔹 Orden por defecto al iniciar: fecha más próxima
  useEffect(() => {
    sortOffers('date');
  }, []);

  return { offers, sortOffers };
};
