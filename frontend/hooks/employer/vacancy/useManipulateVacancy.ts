// hooks/employer/vacancy/useManipulateVacancy.ts
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';

// Tipos mínimos
type EstadoDTO = { id: number; name: 'Oculta' | 'Activa' | 'Eliminada' | (string & {}) };

// --- Cache y dedupe (módulo local) ---
let estadosCache: EstadoDTO[] | null = null;
let inflightEstadosPromise: Promise<EstadoDTO[]> | null = null;

export const useManipulateVacancy = () => {
  const router = useRouter();
  const { validateToken } = useTokenValidations();
  const { requestBackend } = useBackendConection();

  // id desde la URL
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vacanteId = Number(id ?? NaN);

  // UI state
  const [vacanteOculta, setVacanteOculta] = useState(false);
  const [alerta, setAlerta] = useState<null | 'Ocultar' | 'Mostrar' | 'Eliminar'>(null);

  // datos
  const [estadosVacante, setEstadosVacante] = useState<EstadoDTO[]>([]);
  const [loadingEstados, setLoadingEstados] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  // Mapa rápido nombre->id (memo para no recalcular)
  const estadosMap = useMemo(() => {
    const map = new Map<string, EstadoDTO>();
    for (const e of estadosVacante) map.set(e.name.toLowerCase(), e);
    return map;
  }, [estadosVacante]);

  // --- Carga de estados con cache + dedupe + cancelación ---
  const fetchEstados = useCallback(async () => {
    if (estadosCache) {
      setEstadosVacante(estadosCache);
      return;
    }
    if (!inflightEstadosPromise) {
      inflightEstadosPromise = (async () => {
        const result = (await requestBackend('/api/vacancy-states/', null, 'GET')) as EstadoDTO[] | null;
        return Array.isArray(result) ? result : [];
      })();
    }
    const data = await inflightEstadosPromise;
    estadosCache = data;
    setEstadosVacante(data);
    inflightEstadosPromise = null;
  }, [requestBackend]);

  // Efecto inicial: valida token y trae estados una sola vez
  useEffect(() => {
    let mounted = true;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    (async () => {
      try {
        setLoadingEstados(true);
        await validateToken('employer'); // importante: espera validación
        if (!mounted) return;
        await fetchEstados();
      } catch (err) {
        if (mounted) setEstadosVacante([]);
        console.log('Error inicial useManipulateVacancy:', err);
      } finally {
        if (mounted) setLoadingEstados(false);
      }
    })();

    return () => {
      mounted = false;
      abortRef.current?.abort();
    };
  }, [validateToken, fetchEstados]);

  // --- Acción principal: cambiar estado ---
  const cambiarEstadoVacante = useCallback(
    async (vacId: number, nombreEstado: 'Oculta' | 'Activa' | 'Eliminada') => {
      const estado = estadosMap.get(nombreEstado.toLowerCase());
      if (!estado) {
        console.log(`No se encontró el estado "${nombreEstado}"`);
        return null;
      }

      try {
        await requestBackend(`/api/vacancies/${vacId}/state/`, { state_id: estado.id }, 'PATCH');

        // reflejo local simple
        if (nombreEstado === 'Oculta') setVacanteOculta(true);
        if (nombreEstado === 'Activa') setVacanteOculta(false);

        return nombreEstado;
      } catch (error) {
        console.log('Error al actualizar la vacante:', error);
        return null;
      } finally {
        // cierra cualquier alerta abierta
        setAlerta(null);
      }
    },
    [estadosMap, requestBackend]
  );

  // --- Handlers confirm ---
  const onConfirmOcultar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Oculta');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmMostrar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Activa');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmEliminar = useCallback(async () => {
    const result = await cambiarEstadoVacante(vacanteId, 'Eliminada');
    if (result === 'Eliminada') {
      // si preferís que navegue la SCREEN, podés devolver un flag en el return del hook
      router.replace('/employer');
    }
  }, [cambiarEstadoVacante, vacanteId, router]);

  // --- API pública del hook ---
  return {
    vacanteId,

    // flags UI
    vacanteOculta,
    setVacanteOculta,

    // alertas (compactado)
    alerta, // null | 'Ocultar' | 'Mostrar' | 'Eliminar'
    setAlerta,

    // datos
    estadosVacante,
    loadingEstados,

    // acciones
    onConfirmOcultar,
    onConfirmMostrar,
    onConfirmEliminar,
  };
};
