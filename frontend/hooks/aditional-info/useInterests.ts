// src/hooks/aditional-info/useIntereses.ts
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/useBackendConection';

export const useInterests = () => {
  const [intereses, setIntereses] = useState<string[]>([]);
  const { requestBackend, loading, error } = useBackendConection<string[]>();

  // Traer intereses cuando se monta el componente
  const fetchIntereses = async () => {
    const data = await requestBackend('/intereses', {}, 'GET'); // Cambiá la ruta si es distinta
    if (data) {
      setIntereses(data);
    }
  };

  // Enviar intereses seleccionados al backend
  const enviarInteresesSeleccionados = async (accessToken: string, interesesSeleccionados: string[]) => {
    return await requestBackend(
      '/perfil/intereses', // Cambiá el endpoint si es distinto
      {
        intereses: interesesSeleccionados
      },
      'POST',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  };

  useEffect(() => {
    fetchIntereses();
  }, []);

  return {
    intereses,
    loading,
    error,
    enviarInteresesSeleccionados,
  };
};
