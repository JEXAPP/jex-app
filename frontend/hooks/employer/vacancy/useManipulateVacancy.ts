import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';


type EstadoNombre = 'Oculta' | 'Activa' | 'En Borrador' | 'Llena' | 'Vencida' | 'Eliminada';
type EstadoDTO = { id: number; name: EstadoNombre };

export const useManipulateVacancy = () => {
  const router = useRouter();
  const { requestBackend } = useBackendConection();

  // Ref para requestBackend (evita re-disparar efectos por cambios de ref)
  const requestRef = useRef(requestBackend);
  useEffect(() => { requestRef.current = requestBackend; }, [requestBackend]);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const vacanteId = Number(id ?? NaN);

  const [vacanteOculta, setVacanteOculta] = useState(false);
  const [alerta, setAlerta] = useState<null | 'Ocultar' | 'Mostrar' | 'Eliminar' | 'Publicar'>(null);

  const [publicarDisabled, setPublicarDisabled] = useState(false);

  const [estadosVacante, setEstadosVacante] = useState<EstadoDTO[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [estadoActual, setEstadoActual] = useState<EstadoNombre | null>(null);

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
        const result = await requestRef.current('/api/vacancies/vacancy-states/', null, 'GET');
        return Array.isArray(result) ? (result as EstadoDTO[]) : [];
      })();
    }
  }, []);

  const fetchEstadoActual = useCallback(async (vacId: number, estados: EstadoDTO[]) => {
    if (!Number.isFinite(vacId)) return;

    try {
      const data = await requestRef.current(`/api/vacancies/${vacId}/details`, null, 'GET');
      const rawName: string | undefined =
        data?.state?.name ??
        data?.state ??
        data?.status ??
        data?.vacancy_state?.name ??
        data?.state_name;

      let nombre: EstadoNombre | null = null;

      if (typeof rawName === 'string') {
        const found = estados.find(e => e.name.toLowerCase() === rawName.toLowerCase());
        if (found) nombre = found.name;
      } else {
        // Si viene por id numérico
        const rawId: number | undefined =
          data?.state?.id ?? data?.state_id ?? data?.vacancy_state_id;
        if (typeof rawId === 'number') {
          const found = estados.find(e => e.id === rawId);
          if (found) nombre = found.name;
        }
      }

      if (nombre) {
        setEstadoActual(nombre);
        setVacanteOculta(nombre === 'Oculta'); // (solo "Oculta" es oculta para la UI)
      } else {
        console.log('[useManipulateVacancy] Estado no reconocido en /vacancies/{id}/');
      }
    } catch (err) {
      console.log('[useManipulateVacancy] Error cargando detalle de vacante:', err);
    }
  }, []);

  const handlePublicar = () => {
    setPublicarDisabled(true); // se deshabilita inmediatamente              // dispara el cambio de estado a "Activa"
  };

  const permisos = useMemo(() => {
    const st = estadoActual;

    const base = {
      canEditar: false,
      canEliminar: true,  // por defecto se puede eliminar salvo que la app decida lo contrario
      canOcultar: false,
      canMostrar: false,
      canPublicar: false
    };

    if (st === 'En Borrador') {
      return { ...base, canEditar: true, canEliminar: true, canOcultar: false, canMostrar: false, canPublicar: true };
    }
    if (st === 'Activa') {
      return { ...base, canEditar: false, canEliminar: true, canOcultar: true,  canMostrar: false, canPublicar: false };
    }
    if (st === 'Oculta') {
      return { ...base, canEditar: false, canEliminar: true, canOcultar: false, canMostrar: true, canPublicar: false  };
    }
    // Llena / Vencida / Eliminada → "no se puede editar" es la única condición
    return { ...base, canEditar: false, canEliminar: true, canOcultar: true, canMostrar: false, canPublicar: false };
  }, [estadoActual]);

  // === Effects ===============================================================

  // Efecto inicial: carga estados + estado actual una vez
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingEstados(true);
        const ests = await fetchEstados();
        if (!mounted) return;
        setEstadosVacante(ests);
        await fetchEstadoActual(vacanteId, ests);
      } catch (err) {
        if (mounted) setEstadosVacante([]);
        console.log('Error inicial useManipulateVacancy:', err);
      } finally {
        if (mounted) setLoadingEstados(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const cambiarEstadoVacante = useCallback(
    async (vacId: number, nombreEstado: EstadoNombre) => {
      const estado = estadosMap.get(nombreEstado.toLowerCase());
      if (!estado) { console.log(`No se encontró el estado "${nombreEstado}"`); return null; }

      try {
        await requestRef.current(`/api/vacancies/${vacId}/state/`, { state_id: estado.id }, 'PATCH');
        setEstadoActual(nombreEstado);
        setVacanteOculta(nombreEstado === 'Oculta');
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

  const onConfirmOcultar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Oculta');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmActivar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Activa');
    handlePublicar();
    setPublicarDisabled(false);
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmMostrar = useCallback(async () => {
    await cambiarEstadoVacante(vacanteId, 'Activa');
  }, [cambiarEstadoVacante, vacanteId]);

  const onConfirmEliminar = useCallback(async () => {
    const result = await cambiarEstadoVacante(vacanteId, 'Eliminada');
    if (result === 'Eliminada') router.replace('/employer');
  }, [cambiarEstadoVacante, vacanteId, router]);

  const onIrAEditar = useCallback(() => {
    if (!Number.isFinite(vacanteId)) {
      console.log('No hay vacanteId válido para editar');
      return;
    }
    router.push(`/employer/vacancy/edit-vacancy?id=${vacanteId}`);
  }, [router, vacanteId]);

  return {
    estadosVacante,
    loadingEstados,
    estadoActual,
    vacanteOculta,
    alerta, setAlerta,
    ...permisos, // canEditar, canEliminar, canOcultar, canMostrar
    onConfirmOcultar,
    onConfirmMostrar,
    onConfirmEliminar,
    onConfirmActivar,
    onIrAEditar,
    handlePublicar,
    publicarDisabled
  };
};
