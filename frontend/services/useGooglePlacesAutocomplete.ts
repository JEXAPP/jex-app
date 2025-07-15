import { useState, useCallback } from 'react';
import { config } from '@/config';
import axios from 'axios';

const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

export default function useGooglePlacesAutocomplete() {
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buscarSugerencias = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSugerencias([]);
      return;
    }

    try {
      setCargando(true);
      const apiKey = `${config.googleApiKey}`;

      const respuesta = await axios.get(GOOGLE_PLACES_API, {
        params: {
          input,
          key: apiKey,
          language: 'es',
          components: 'country:ar'
        }
      });

      const predicciones = respuesta.data?.predictions;
      if (predicciones && Array.isArray(predicciones)) {
        const resultados: string[] = predicciones.map((pred: any) => pred.description);
        setSugerencias(resultados);
      } else {
        setSugerencias([]);
      }
    } catch (err) {
      console.error('Error en Google Places:', err);
      setError('No se pudo cargar la ubicación');
    } finally {
      setCargando(false);
    }
  }, []);

  return {
    sugerencias,
    setSugerencias,
    cargando,
    error,
    buscarSugerencias,
  };
}
