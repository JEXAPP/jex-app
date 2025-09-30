// /hooks/payments/useMercadoPagoOAuth.ts
import { useCallback, useMemo, useRef, useState } from 'react';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import useBackendConection from '@/services/internal/useBackendConection';
import { config } from '@/config';

// ---- Tipos ----
export type MpLinkedInfo = {
  mp_user_id: string;
  nickname?: string;
  email?: string;
  scope?: string;
  linked_at?: string; // ISO
};

export type LinkState = 'idle' | 'opening' | 'waiting' | 'linked' | 'error';

type Options = {
  clientId?: string;
  redirectUri?: string;
  statusPath?: string;       // default: '/api/auth/mercadopago/status'
  pollIntervalMs?: number;   // default: 2000
  maxPolls?: number;         // default: 30
};

// ---- Constantes ----
const SECURE_KEY = 'mp_linked_info';

// Tomamos de config.ts (acepta mercadoPago o mercadopago por si varía el casing)
const cfgFromConfig = {
  clientId:
    (config as any)?.mercadoPago?.clientId ??
    (config as any)?.mercadopago?.clientId,
  redirectUri:
    (config as any)?.mercadoPago?.redirectUri ??
    (config as any)?.mercadopago?.redirectUri,
};

const DEFAULTS = {
  clientId: String(cfgFromConfig.clientId || ''),
  redirectUri: String(cfgFromConfig.redirectUri || ''),
  statusPath: '/api/auth/mercadopago/status',
  pollIntervalMs: 2000,
  maxPolls: 30,
};

// ---- Utils ----
function buildAuthUrl(clientId: string, redirectUri: string) {
  if (!clientId) throw new Error('[useMercadoPagoOAuth] Falta clientId en config.');
  if (!redirectUri) throw new Error('[useMercadoPagoOAuth] Falta redirectUri en config.');

  const u = new URL('https://auth.mercadopago.com.ar/authorization');
  u.searchParams.set('client_id', clientId);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('platform_id', 'mp');
  u.searchParams.set('redirect_uri', redirectUri);
  return u.toString();
}

// ---- Hook servicio ----
export function useMercadoPagoOAuth(opts?: Options) {
  const base = { ...DEFAULTS, ...(opts ?? {}) };

  const authUrl = useMemo(
    () => buildAuthUrl(base.clientId, base.redirectUri),
    [base.clientId, base.redirectUri]
  );

  const { requestBackend } = useBackendConection();

  const [status, setStatus] = useState<LinkState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<MpLinkedInfo | null>(null);
  const [busy, setBusy] = useState(false);

  // para cortar el polling si hace falta
  const pollingRef = useRef<{ active: boolean; count: number }>({ active: false, count: 0 });

  // ---- Estado local (persistencia mínima) ----
  const loadLocal = useCallback(async () => {
    try {
      const raw = await SecureStore.getItemAsync(SECURE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MpLinkedInfo;
        setInfo(parsed);
        setStatus('linked');
      }
    } catch {
      /* noop */
    }
  }, []);

  const clearLocal = useCallback(async () => {
    await SecureStore.deleteItemAsync(SECURE_KEY);
    setInfo(null);
    setStatus('idle');
    setError(null);
  }, []);

  // ---- Abrir autorización en navegador externo (permite cámara) ----
  const openAuthorization = useCallback(
    async (): Promise<{ ok: true } | { ok: false; error: string }> => {
      try {
        setError(null);
        setStatus('opening');

        const can = await Linking.canOpenURL(authUrl);
        if (!can) throw new Error('No se pudo abrir el navegador del sistema');

        await Linking.openURL(authUrl);

        // El redirect vuelve al backend; al regresar a la app, consultamos estado
        setStatus('waiting');
        return { ok: true };
      } catch (e: any) {
        const msg = e?.message ?? 'No se pudo abrir Mercado Pago';
        setStatus('error');
        setError(msg);
        return { ok: false, error: msg };
      }
    },
    [authUrl]
  );

  // ---- Consultar estado en backend ----
  const refreshStatus = useCallback(async (): Promise<MpLinkedInfo | null> => {
    try {
      const data = await requestBackend(base.statusPath, null, 'GET');

      if (data?.linked && data.mp_user_id) {
        const linkedInfo: MpLinkedInfo = {
          mp_user_id: data.mp_user_id,
          nickname: data.nickname,
          email: data.email,
          scope: data.scope,
          linked_at: data.linked_at,
        };
        await SecureStore.setItemAsync(SECURE_KEY, JSON.stringify(linkedInfo));
        setInfo(linkedInfo);
        setStatus('linked');
        return linkedInfo;
      }

      if (status !== 'opening') setStatus('waiting');
      return null;
    } catch (e: any) {
      const msg = e?.message ?? 'Error consultando estado de vinculación';
      setError(msg);
      setStatus('error');
      return null;
    }
  }, [base.statusPath, requestBackend, status]);

  // ---- Polling automático hasta “linked” o timeout ----
  const waitUntilLinked = useCallback(async (): Promise<MpLinkedInfo | null> => {
    if (busy) return null;
    setBusy(true);
    setError(null);
    setStatus('waiting');
    pollingRef.current = { active: true, count: 0 };

    try {
      while (pollingRef.current.active && pollingRef.current.count < base.maxPolls) {
        const res = await refreshStatus();
        if (res) {
          pollingRef.current.active = false;
          setBusy(false);
          return res;
        }
        pollingRef.current.count += 1;
        await new Promise((r) => setTimeout(r, base.pollIntervalMs));
      }
      // timeout
      if (pollingRef.current.active) {
        pollingRef.current.active = false;
        setStatus('idle');
      }
      return null;
    } finally {
      setBusy(false);
    }
  }, [busy, refreshStatus, base.maxPolls, base.pollIntervalMs]);

  const stopWaiting = useCallback(() => {
    pollingRef.current.active = false;
    if (status === 'waiting') setStatus('idle');
  }, [status]);

  return {
    // estado
    status,
    error,
    info,
    busy,
    authUrl,

    // acciones
    openAuthorization,
    refreshStatus,
    waitUntilLinked,
    stopWaiting,
    loadLocal,
    clearLocal,
  };
}
