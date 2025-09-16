import { useCallback, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import useBackendConection from '@/services/internal/useBackendConection';

type ScanState = { kind: 'idle' | 'posting' | 'ok' | 'error'; msg?: string };

function parseOfferIdFromToken(token: string): number | null {
  try {
    const trimmed = token?.trim();
    if (!trimmed) return null;

    // A) QR con JSON {"offer_id": 4, ...}
    if (trimmed.startsWith('{')) {
      const obj = JSON.parse(trimmed);
      const cand = obj.offer_id ?? obj.offerId ?? obj.offer ?? obj.id ?? obj?.data?.offer_id;
      const n = Number(cand);
      return Number.isFinite(n) ? n : null;
    }

    // B) Formato pipe: jex|offer:4|ts:...|h:...
    const m = trimmed.match(/offer:(\d+)/i);
    if (m) return Number(m[1]);

    // C) Simple: primer segmento numérico o todo el string numérico
    const first = trimmed.split('|')[0];
    const n = Number(first);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function useAttendance() {
  const { requestBackend } = useBackendConection();
  const [permission, requestPermission] = useCameraPermissions();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanState, setScanState] = useState<ScanState>({ kind: 'idle' });
  const [showConfirm, setShowConfirm] = useState(false);

  // anti-doble post
  const postingRef = useRef(false);
  const lastValueRef = useRef<string | null>(null);
  const lastTimeRef = useRef<number>(0);

  const startScan = useCallback(async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        if (!res.canAskAgain) {
          Alert.alert(
            'Permiso de cámara',
            'Habilitá la cámara desde Ajustes para poder escanear.',
            [
              { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
              { text: 'Cancelar', style: 'cancel' },
            ]
          );
        }
        return;
      }
    }
    setScanState({ kind: 'idle' });
    setIsScannerOpen(true);
  }, [permission, requestPermission]);

  const stopScan = useCallback(() => {
    setIsScannerOpen(false);
    // reset debounce
    postingRef.current = false;
    lastValueRef.current = null;
    lastTimeRef.current = 0;
    setScanState({ kind: 'idle' });
  }, []);

  const onBarcodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      const value = result?.data;
      if (!value) return;

      // debounce (1.2s) + evitar posts concurrentes
      const now = Date.now();
      if (postingRef.current) return;
      if (value === lastValueRef.current && now - lastTimeRef.current < 1200) return;

      const offerId = parseOfferIdFromToken(value);
      if (!offerId) {
        setScanState({ kind: 'error', msg: 'QR inválido.' });
        return;
      }

      postingRef.current = true;
      lastValueRef.current = value;
      lastTimeRef.current = now;
      setScanState({ kind: 'posting', msg: 'Registrando asistencia...' });

      try {
        const url = `api/applications/attendance-confirmation/${offerId}/`;
      console.log('[ATTENDANCE CONFIRM][REQUEST]', { url, method: 'POST' });

      const res = await requestBackend(url, null, 'POST');

      console.log('[ATTENDANCE CONFIRM][OK] raw:', res);
      try { console.log('[ATTENDANCE CONFIRM][OK] pretty:', JSON.stringify(res, null, 2)); } catch {}

      setScanState({ kind: 'ok', msg: 'Asistencia registrada ✔️' });
      setShowConfirm(true);
    } catch (e: any) {
      // 👇👇👇 AQUÍ VA LO QUE QUERÍAS AGREGAR
      const status = e?.response?.status;
      const data   = e?.response?.data;
      console.log('[ATTENDANCE CONFIRM] status:', status);
      console.log('[ATTENDANCE CONFIRM] data:', JSON.stringify(data, null, 2));
      console.log('[ATTENDANCE CONFIRM] error:', e);

      const msg = data?.detail || data?.message || data?.error || 'No se pudo registrar.';
      setScanState({ kind: 'error', msg });
      // opcional:
      // Alert.alert('Error', msg);
    } finally {
      postingRef.current = false;
    }
  },
  [requestBackend]
);

  return {
    isScannerOpen,
    scanState,
    showConfirm,
    setShowConfirm,
    startScan,
    stopScan,
    onBarcodeScanned,
  };
}
