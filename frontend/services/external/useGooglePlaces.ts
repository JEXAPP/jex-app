// hooks/location/useGooglePlaces.ts
import { useState, useCallback } from 'react';
import { config } from '@/config';
import axios from 'axios';

type Sugerencia = { descripcion: string; placeId: string };
type Coordenadas = { lat: number; lng: number };

export default function useGooglePlaces() {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
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
          components: 'country:ar',
        },
      });

      const predicciones = respuesta.data?.predictions;
      setSugerencias(
        Array.isArray(predicciones)
          ? predicciones.map((p: any) => ({ descripcion: p.description, placeId: p.place_id }))
          : []
      );
    } catch {
      setError('No se pudo cargar la ubicación');
    } finally {
      setCargando(false);
    }
  }, []);

  const obtenerCoordenadas = async (placeId: string): Promise<Coordenadas> => {
    const apiKey = config.google.apiKey;

    const respuesta = await axios.get(`${config.google.placesDetail}`, {
      params: {
        place_id: placeId,
        key: apiKey,
        language: 'es',
        fields: 'geometry',
      },
    });

    const loc = respuesta.data?.result?.geometry?.location;
    if (!loc) throw new Error('No se encontró la ubicación');
    return { lat: loc.lat, lng: loc.lng };
  };

  const obtenerLocalidadesDeProvincia = useCallback(
    async (provincia: string, query: string): Promise<Sugerencia[]> => {
      if (!provincia || !query || query.trim().length < 3) return [];
      const apiKey = config.google.apiKey;

      const input = `${query}, ${provincia}, Argentina`;

      const resp = await axios.get(`${config.google.placesAutocomplete}`, {
        params: {
          input,
          key: apiKey,
          language: 'es',
          components: 'country:ar',
        },
      });

      const preds: any[] = resp.data?.predictions ?? [];

      return preds
        .filter((p) =>
          typeof p.description === 'string' &&
          p.description.toLowerCase().includes(provincia.toLowerCase())
        )
        .map((p) => ({
          descripcion: p.description as string,
          placeId: p.place_id as string,
        }));
    },
    []
  );

  return {
    // estado
    sugerencias,
    setSugerencias,
    cargando,
    error,
    // métodos
    buscarSugerencias,
    obtenerCoordenadas,
    obtenerLocalidadesDeProvincia,
  };
}
