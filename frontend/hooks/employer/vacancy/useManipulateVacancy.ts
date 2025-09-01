// hooks/employer/vacancy/useManipulateVacancy.ts
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

// Tipos mínimos usados en la pantalla
type EstadoDTO = { id: number; name: 'Oculta' | 'Activa' | 'En Borrador' | 'Llena' | 'Vencida' | 'Eliminada' };

// Cache de módulo para evitar llamadas repetidas
let estadosCache: EstadoDTO[] | null = null;
let inflightEstadosPromise: Promise<EstadoDTO[]> | null = null;

export const useManipulateVacancy = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  // Ref para requestBackend (evita re-disparar efectos)
  const requestRef = useRef(requestBackend);
  useEffect(() => { requestRef.current = requestBackend; }, [requestBackend]);

  // Id desde la URL
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vacanteId = Number(id ?? NaN);

  // UI
  const [vacanteOculta, setVacanteOculta] = useState(false);
  const [alerta, setAlerta] = useState<null | 'Ocultar' | 'Mostrar' | 'Eliminar'>(null);

  // Datos
  const [estadosVacante, setEstadosVacante] = useState<EstadoDTO[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);

  // Mapa nombre -> estado (O(1) lookup)
  const estadosMap = useMemo(() => {
    const map = new Map<string, EstadoDTO>();
    for (const e of estadosVacante) map.set(e.name.toLowerCase(), e);
    return map;
  }, [estadosVacante]);

  // Trae estados con cache + dedupe
  const fetchEstados = useCallback(async () => {
    if (estadosCache) { setEstadosVacante(estadosCache); return; }
    if (!inflightEstadosPromise) {
      inflightEstadosPromise = (async () => {
        const result = await requestRef.current('/api/vacancy-states/', null, 'GET');
        return Array.isArray(result) ? (result as EstadoDTO[]) : [];
      })();
    }
    const data = await inflightEstadosPromise;
    estadosCache = data;
    setEstadosVacante(data);
    inflightEstadosPromise = null;
  }, []);

  // Efecto inicial: carga estados una vez
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingEstados(true);
        if (!mounted) return;
        await fetchEstados();
      } catch (err) {
        if (mounted) setEstadosVacante([]);
        console.log('Error inicial useManipulateVacancy:', err);
      } finally {
        if (mounted) setLoadingEstados(false);
      }
    })();
    return () => { mounted = false; };
    // deps vacías: se corre una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualiza estado en backend y refleja en UI
  const cambiarEstadoVacante = useCallback(
    async (vacId: number, nombreEstado: EstadoDTO['name']) => {
      const estado = estadosMap.get(nombreEstado.toLowerCase());
      if (!estado) { console.log(`No se encontró el estado "${nombreEstado}"`); return null; }

      try {
        await requestRef.current(`/api/vacancies/${vacId}/state/`, { state_id: estado.id }, 'PATCH');
        if (nombreEstado === 'Oculta' || nombreEstado === 'En Borrador') setVacanteOculta(true);
        if (nombreEstado === 'Activa') setVacanteOculta(false);
        return nombreEstado;
      } catch (error) {
        console.log('Error al actualizar la vacante:', error);
        return null;
      } finally {
        setAlerta(null);
      }
    },
    [estadosMap]
  );

  // Handlers de confirmación (UI)
  const onConfirmOcultar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Oculta');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmMostrar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Activa');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmEliminar = useCallback(async () => {
    const result = await cambiarEstadoVacante(vacanteId, 'Eliminada');
    if (result === 'Eliminada') router.replace('/employer');
  }, [cambiarEstadoVacante, vacanteId, router]);

  // API pública del hook
  return {
    vacanteId,
    vacanteOculta, setVacanteOculta,
    alerta, setAlerta,
    estadosVacante, loadingEstados,
    onConfirmOcultar, onConfirmMostrar, onConfirmEliminar,
  };
};
