// /hooks/employer/useSearchEmployees.ts
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Nuevo servicio Open Source (GeoRef)
import {
  listarProvincias,
  buscarLocalidades,
  debounce as makeDebounce,
  type Sugerencia,
} from '@/services/external/sugerencias/useGeoRefAr';

// ----------------- Utiles de fecha (igual que antes) -----------------
type Sug = { descripcion: string; placeId: string };

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const ddmmyyyy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

const today = new Date();
const MIN_DATE = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const MAX_DATE = new Date(today.getFullYear() + 2, 11, 31);
const clampDate = (d: Date) => {
  const only = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return only < MIN_DATE ? MIN_DATE : only > MAX_DATE ? MAX_DATE : only;
};

// ----------------- Tipos internos -----------------
export type BubbleKey = 'location' | 'availability' | 'history';

// Para manejar provincia elegida con id (requerido por GeoRef)
type ProvinciaSel = { id: string; nombre: string };

// ----------------- Hook -----------------
export function useSearchEmployees() {
  // UI
  const [activeBubble, setActiveBubble] = useState<BubbleKey>('location');
  const toggleBubble = useCallback((b: BubbleKey) => setActiveBubble(b), []);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const closeError = useCallback(() => setShowError(false), []);
  const err = useCallback((msg: string) => { setErrorMessage(msg); setShowError(true); }, []);

  // ----------------- Ubicación -----------------
  const [provinciaInput, setProvinciaInput] = useState('');
  const [localidadInput, setLocalidadInput] = useState('');

  // Opciones de provincia (ahora vienen del GeoRef de forma asíncrona)
  const [provinciaOptions, setProvinciaOptions] = useState<Sug[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);

  // Provincia seleccionada (guardamos id+nombre porque GeoRef pide id para buscar localidades)
  const [selectedProvincia, setSelectedProvincia] = useState<ProvinciaSel | null>(null);

  // Localidad seleccionada y sugerencias
  const [selectedLocalidad, setSelectedLocalidad] = useState<Sugerencia | null>(null);
  const [localidadSug, setLocalidadSug] = useState<Sugerencia[]>([]);
  const canPickLocalidad = !!selectedProvincia;

  // Cargar provincias al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingProvincias(true);
        const provs = await listarProvincias(); // [{id, nombre}]
        // Adaptamos al mismo shape que tus pickers (descripcion/placeId)
        const opts: Sug[] = provs
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
          .map(p => ({
            descripcion: p.nombre,
            placeId: `prov:${p.id}|provName:${p.nombre}`,
          }));
        if (mounted) setProvinciaOptions(opts);
      } catch (e) {
        console.warn('Error listando provincias', e);
      } finally {
        if (mounted) setLoadingProvincias(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const parseProvinciaIdFromPlaceId = (placeId: string) => {
    // Formato: "prov:<id>|provName:<nombre>"
    const parts = placeId.split('|');
    const idPart = parts.find(p => p.startsWith('prov:'));
    const namePart = parts.find(p => p.startsWith('provName:'));
    const id = idPart ? idPart.replace('prov:', '') : '';
    const nombre = namePart ? namePart.replace('provName:', '') : '';
    return { id, nombre };
  };

  const onProvinciaPick = useCallback((item: Sug) => {
    const { id, nombre } = parseProvinciaIdFromPlaceId(item.placeId);
    setSelectedProvincia({ id, nombre: nombre || item.descripcion });
    setProvinciaInput(item.descripcion);
    // reset localidad
    setSelectedLocalidad(null);
    setLocalidadInput('');
    setLocalidadSug([]);
  }, []);

  // Debounce para cambios de localidad
  const debouncedFetchLocalidadesRef = useRef<ReturnType<typeof makeDebounce> | null>(null);
  if (!debouncedFetchLocalidadesRef.current) {
    debouncedFetchLocalidadesRef.current = makeDebounce(async (provId: string, q: string) => {
      try {
        const res = await buscarLocalidades(provId, q);
        setLocalidadSug(res);
      } catch (e) {
        console.warn('Error buscando localidades', e);
        setLocalidadSug([]);
      }
    }, 300);
  }

  const onLocalidadChange = useCallback(
    async (text: string) => {
      setLocalidadInput(text);
      setSelectedLocalidad(null);
      setLocalidadSug([]);
      if (!selectedProvincia) return;
      const q = text.trim();
      if (q.length < 2) return;
      debouncedFetchLocalidadesRef.current!(selectedProvincia.id, q);
    },
    [selectedProvincia]
  );

  const onLocalidadPick = useCallback((item: Sugerencia) => {
    setSelectedLocalidad(item);
    setLocalidadInput(item.descripcion);
    setLocalidadSug([]);
  }, []);

  const onLocalidadClear = useCallback(() => {
    setSelectedLocalidad(null);
    setLocalidadInput('');
    setLocalidadSug([]);
  }, []);

  // ----------------- Disponibilidad -----------------
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isRange, setIsRange] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const setSingleDate = useCallback((d: Date) => {
    const c = clampDate(d);
    setStartDate(c); setEndDate(c); setIsRange(false);
  }, []);

  const applyDateSelection = useCallback((start: Date | null, end: Date | null) => {
    if (start && end && start.getTime() !== end.getTime()) {
      setStartDate(clampDate(start)); setEndDate(clampDate(end)); setIsRange(true);
    } else if (start) {
      setSingleDate(start);
    } else {
      setStartDate(null); setEndDate(null); setIsRange(false);
    }
  }, [setSingleDate]);

  const showTimePickers = !!startDate;

  const normalizeSingleDayTimes = useCallback(() => {
    if (!(startTime && endTime)) return;
    const [hi, mi] = startTime.split(':').map(Number);
    const [hf, mf] = endTime.split(':').map(Number);
    if (hi * 60 + mi > hf * 60 + mf) setEndTime(startTime);
  }, [startTime, endTime]);

  // ----------------- Historial -----------------
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [jobsMin, setJobsMin] = useState<number | null>(null);
  const decRating = useCallback(() => setRatingMin(p => Math.max(0, Math.round((p - 0.5) * 2) / 2)), []);
  const incRating = useCallback(() => setRatingMin(p => Math.min(5, Math.round((p + 0.5) * 2) / 2)), []);

  // ----------------- Acciones -----------------
  const validarParaBuscar = useCallback(() => {
    if (localidadInput && !selectedProvincia) { err('Primero seleccioná una provincia.'); return false; }
    if (localidadInput && !selectedLocalidad) { err('Elegí una localidad de la lista de sugerencias.'); return false; }
    if (startDate && (startDate < MIN_DATE || startDate > MAX_DATE)) { err('La fecha de inicio está fuera del rango permitido.'); return false; }
    if (endDate && (endDate < MIN_DATE || endDate > MAX_DATE)) { err('La fecha de fin está fuera del rango permitido.'); return false; }
    if (!isRange && startTime && endTime) {
      const [hi, mi] = startTime.split(':').map(Number);
      const [hf, mf] = endTime.split(':').map(Number);
      if (hi * 60 + mi > hf * 60 + mf) { err('En día único, la hora de inicio no puede ser mayor a la hora de fin.'); return false; }
    }
    return true;
  }, [localidadInput, selectedProvincia, selectedLocalidad, startDate, endDate, isRange, startTime, endTime, err]);

  const limpiarTodo = useCallback(() => {
    setProvinciaInput(''); setLocalidadInput('');
    setSelectedProvincia(null); setSelectedLocalidad(null); setLocalidadSug([]);
    setStartDate(null); setEndDate(null); setIsRange(false); setStartTime(null); setEndTime(null);
    setRatingMin(0); setJobsMin(null); setActiveBubble('location');
  }, []);

  const onBuscar = () => {
    const params = new URLSearchParams({
      ...(selectedProvincia && { province: selectedProvincia.nombre }),
      ...(selectedLocalidad && { locality: selectedLocalidad.descripcion }),
      ...(startDate && { start_date: ddmmyyyy(startDate) }),
      ...(endDate && { end_date: ddmmyyyy(endDate) }),
      ...(startTime && { start_time: startTime }),
      ...(endTime && { end_time: endTime }),
      ...(jobsMin != null && { min_jobs: String(jobsMin) }),
      ...(ratingMin > 0 && { min_rating: String(ratingMin) }),
    });
    router.push(`/employer/candidates/results?${params.toString()}`);
  };

  const labels = useMemo(() => ({ minDate: ddmmyyyy(MIN_DATE), maxDate: ddmmyyyy(MAX_DATE) }), []);

  return {
    // UI
    activeBubble, toggleBubble, showError, errorMessage, closeError,

    // Ubicación
    provinciaInput,
    provinciaOptions,           // ahora viene del GeoRef
    loadingProvincias,
    localidadInput, localidadSug,
    selectedProvincia, selectedLocalidad,
    onProvinciaPick, onLocalidadChange, onLocalidadPick, onLocalidadClear, canPickLocalidad,

    // Disponibilidad
    startDate, endDate, isRange, setSingleDate, applyDateSelection,
    startTime, endTime, setStartTime, setEndTime, showTimePickers, normalizeSingleDayTimes, labels,

    // Historial
    ratingMin, setRatingMin, jobsMin, setJobsMin, decRating, incRating,

    // Acciones
    validarParaBuscar, limpiarTodo, onBuscar,
  };
}
