import { useState } from 'react';

export const useApplyJob = () => {
  // Datos simulados del trabajo
  const [job] = useState({
    title: 'Evento',
    rating: 5,
    location: 'Campo Cosquín',
    logo: '@/assets/images/jex/JEX-festival.png',
    mapImage: 'https://maps.gstatic.com/tactile/pane/default_geocode-1x.png', // Imagen mock
    description:
      'Buscamos fotógrafos para capturar imágenes que reflejen la energía, la cultura y el espíritu del festival.',
    date: 'Jueves 12 de Noviembre del 2025',
    time: '12:30 p.m.',
    requirements: [
      'Experiencia en fotografía de eventos masivos o recitales',
    ],
    salary: '200.000',
    deadline: '20/05 a las 23:59hs',
    role: 'Rol'
  });

  // Datos simulados del organizador
  const [organizer] = useState({
    name: 'Juan Lopez',
    rating: 4.2,
    reviews: 52,
    jexTime: '2 años en Jex',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=juanlopez',
  });

  // Simula postulación
  const handleApply = () => {
    console.log('Usuario postulado con éxito');
    // En producción: hacer POST al backend y manejar respuesta
  };

  return {
    job,
    organizer,
    handleApply,
  };
};

