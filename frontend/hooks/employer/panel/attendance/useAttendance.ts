import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useBackendConection from '@/services/internal/useBackendConection';

type ScanState = { kind: 'idle' | 'posting' | 'ok' | 'error'; msg?: string };

export type JobType = string;
export interface EmployeeAttendance {
  employee_id: number;
  employee_name: string;
  job_type: JobType;
  has_attendance: boolean;
}

const toBool = (v: unknown) =>
  v === true ||
  String(v).toLowerCase() === 'true' ||
  String(v) === '1';

export function useAttendance() {
  const { requestBackend } = useBackendConection();

  const params = useLocalSearchParams<{ event_id?: string }>();
  const eventId = Number(params.event_id);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [scanState, setScanState] = useState<ScanState>({ kind: 'idle' });
  const [scannedToken, setScannedToken] = useState<string | null>(null);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employees, setEmployees] = useState<EmployeeAttendance[]>([]);
  const [selectedJobType, setSelectedJobType] = useState<JobType | null>(null);

  const didInitialFetchRef = useRef(false);
  const isFetchingRef = useRef(false);

  const fetchEmployees = useCallback(async () => {
    if (!eventId || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoadingEmployees(true);
    try {
      const url = `/api/applications/attendance/details/${eventId}/`;
      const res = await requestBackend(url, null, 'GET');

      const arr = Array.isArray(res) ? res : [];

      const normalized: EmployeeAttendance[] = arr.map((r: any) => ({
        employee_id: Number(r?.employee_id) || 0,
        employee_name: String(r?.employee_name ?? '').trim(),
        job_type: String(r?.job_type ?? '').trim(),
        has_attendance: toBool(r?.has_attendance),
      }));

      setEmployees(normalized);
    } catch (e: any) {
      const status = e?.response?.status as number | undefined;
      if (status === 401) console.warn('[ATTENDANCE] 401 no autorizado');
      else if (status === 403) console.warn('[ATTENDANCE] 403 sin permisos');
      else if (status === 404) console.warn('[ATTENDANCE] 404 evento no encontrado');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
      isFetchingRef.current = false;
    }
  }, [eventId, requestBackend]);

  useEffect(() => {
    if (!eventId || didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    fetchEmployees();
  }, [eventId, fetchEmployees]);

  //FILTROS
  const jobTypes: JobType[] = useMemo(() => {
    const set = new Set<string>();
    for (const e of employees) if (e.job_type) set.add(e.job_type);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [employees]);

  // AFRUPAR POR JOBTYPES
  const employeesByJobType = useMemo(() => {
    const map: Record<JobType, EmployeeAttendance[]> = {};
    for (const jt of jobTypes) map[jt] = [];
    for (const e of employees) {
      if (!map[e.job_type]) map[e.job_type] = [];
      map[e.job_type].push(e);
    }
    for (const jt of Object.keys(map)) {
      map[jt].sort((a, b) => a.employee_name.localeCompare(b.employee_name));
    }
    return map;
  }, [employees, jobTypes]);

  const summaryByJobType = useMemo(() => {
    const rec: Record<JobType, { total: number; attended: number; progress: number; label: string }> = {};
    for (const jt of jobTypes) {
      const list = employeesByJobType[jt] ?? [];
      const attended = list.filter(e => e.has_attendance).length;
      const total = list.length;
      rec[jt] = { total, attended, progress: total ? attended / total : 0, label: `${attended}/${total}` };
    }
    return rec;
  }, [employeesByJobType, jobTypes]);

  // FILTRO SELECCIONADO
  useEffect(() => {
    if (!selectedJobType && jobTypes.length) setSelectedJobType(jobTypes[0]);
    if (selectedJobType && !jobTypes.includes(selectedJobType)) {
      setSelectedJobType(jobTypes[0] ?? null);
    }
  }, [jobTypes, selectedJobType]);

  const currentList = useMemo(
    () => (selectedJobType ? employeesByJobType[selectedJobType] ?? [] : []),
    [selectedJobType, employeesByJobType]
  );

  //SCANNER --> NO LO TOQUEN PORQUE ME DA MIEDO QUE EXPLOTE
  const startScan = useCallback(() => {
    setScanState({ kind: 'idle' });
    setScannedToken(null);
    setIsScannerOpen(true);
  }, []);
  const stopScan = useCallback(() => setIsScannerOpen(false), []);
  const handleScannedValue = useCallback((token: string) => {
    const t = String(token).trim();
    if (!t) return;
    setIsScannerOpen(false);
    setScannedToken(t);
    setConfirmVisible(true);
  }, []);
  const cancelConfirm = useCallback(() => {
    setConfirmVisible(false);
    setScannedToken(null);
    setTimeout(() => setIsScannerOpen(true), 250);
  }, []);
  const confirmAttendance = useCallback(async () => {
    if (!scannedToken || scanState.kind === 'posting') return;
    try {
      setScanState({ kind: 'posting', msg: 'Registrando asistencia...' });
      await requestBackend('/api/applications/attendance-confirmation/', { qr_token: scannedToken }, 'POST');
      setScanState({ kind: 'ok', msg: 'Asistencia registrada ✔️' });
      setConfirmVisible(false);
      setScannedToken(null);
      // refresh para ver el check actualizado (esta es otra llamada, intencional)
      fetchEmployees();
      setTimeout(() => setIsScannerOpen(true), 250);
    } catch (e: any) {
      const status = e?.response?.status as number | undefined;
      if (status === 400) console.warn('[CONFIRM] 400 solicitud inválida');
      else if (status === 409) console.warn('[CONFIRM] 409 ya registrada / conflicto');
      else if (status && status >= 500) console.warn('[CONFIRM] 5xx error del servidor');
      else console.warn('[CONFIRM] error de red/cliente');
      setScanState({ kind: 'error', msg: 'No se pudo registrar.' });
    }
  }, [scannedToken, scanState.kind, requestBackend, fetchEmployees]);

  return {
    loadingEmployees,
    employees,
    jobTypes,
    employeesByJobType,
    summaryByJobType,
    selectedJobType,
    setSelectedJobType,
    currentList,
    isScannerOpen,
    startScan,
    stopScan,
    handleScannedValue,
    confirmVisible,
    confirmAttendance,
    cancelConfirm,
    scanState,
    refreshEmployees: fetchEmployees,
  };
}

