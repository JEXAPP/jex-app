import { useState, useCallback } from 'react';
import { config } from '@/config';
import axios from 'axios';

export default function useGooglePlaces() {
  const [sugerencias, setSugerencias] = useState<{ descripcion: string; placeId: string }[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buscarSugerencias = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSugerencias([]);
      return;
    }

    try {
      
      setCargando(true);
      const apiKey = `${config.google.apiKey}`;

      
      const respuesta = await axios.get(`${config.google.placesAutocomplete}`, {
        params: {
          input,
          key: apiKey,
          language: 'es',
          components: 'country:ar'
        }
      });

      const predicciones = respuesta.data?.predictions;

      if (predicciones && Array.isArray(predicciones)) {
        const resultados = predicciones.map((pred: any) => ({
          descripcion: pred.description,
          placeId: pred.place_id,
        }));

        setSugerencias(resultados);
      } else {
        setSugerencias([]);
      }
    } catch (err) {
      setError('No se pudo cargar la ubicación');
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerCoordenadas = async (placeId: string) => {
    try {
      const apiKey = config.google.apiKey;

      const respuesta = await axios.get(`${config.google.placesDetail}`, {
        params: {
          place_id: placeId,
          key: apiKey,
          language: 'es',
          fields: 'geometry'
        }
      });

      const location = respuesta.data?.result?.geometry?.location;
      if (location) {
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        throw new Error('No se encontró la ubicación');
      }
    } catch (error) {
      throw error;
    }
  };


  return {
    sugerencias,
    setSugerencias,
    cargando,
    error,
    buscarSugerencias,
    obtenerCoordenadas
  };
}
