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
  statusPath?: string;        // default: '/api/auth/mercadopago/status/'
  generateStatePath?: string; // default: '/api/payments/mercadopago/generate-state/'
  debounceMs?: number;        // default: 1200 (antirrebote para onReturnFromMp)
};

// ---- Constantes ----
const SECURE_KEY = 'mp_linked_info';

// config
const cfgFromConfig = {
  clientId:
    (config as any)?.mercadoPago?.clientId ??
    (config as any)?.mercadopago?.clientId,
  redirectUri:
    (config as any)?.mercadoPago?.redirectUri ??
    (config as any)?.mercadopago?.redirectUri ??
    'https://jexapp.ar/api/payments/mercadopago/callback/',
};

const DEFAULTS = {
  clientId: String(cfgFromConfig.clientId || ''),
  redirectUri: String(cfgFromConfig.redirectUri || ''),
  statusPath: '/api/auth/mercadopago/status/',
  generateStatePath: '/api/payments/mercadopago/generate-state/',
  debounceMs: 1200,
};

// ---- Utils ----
function buildAuthUrl(clientId: string, redirectUri: string, state?: string) {
  if (!clientId) throw new Error('[useMercadoPagoOAuth] Falta clientId en config.');
  if (!redirectUri) throw new Error('[useMercadoPagoOAuth] Falta redirectUri en config.');
  const u = new URL('https://auth.mercadopago.com.ar/authorization');
  u.searchParams.set('client_id', clientId);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('platform_id', 'mp');
  u.searchParams.set('redirect_uri', redirectUri);
  if (state) u.searchParams.set('state', state); // parámetro propio (top-level)
  return u.toString();
}

// ---- Hook servicio ----
export function useMercadoPagoOAuth(opts?: Options) {
  const base = { ...DEFAULTS, ...(opts ?? {}) };
  const { requestBackend } = useBackendConection();

  // URL base SOLO para mostrar/debug (sin state)
  const authUrl = useMemo(
    () => buildAuthUrl(base.clientId, base.redirectUri),
    [base.clientId, base.redirectUri]
  );

  const [status, setStatus] = useState<LinkState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<MpLinkedInfo | null>(null);
  const [busy, setBusy] = useState(false);

  // refs para control de llamadas
  const stateTokenRef = useRef<string | null>(null);       // último state generado
  const statusInFlightRef = useRef<boolean>(false);        // mutex para /status
  const lastStatusAtRef = useRef<number>(0);               // anti rebote temporal

  // ---- Estado local (persistencia mínima) ----
  const loadLocal = useCallback(async () => {
    try {
      const raw = await SecureStore.getItemAsync(SECURE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MpLinkedInfo;
        setInfo(parsed);
        setStatus('linked');
      }
    } catch {/* noop */}
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

        // 1) Generar state JWT (y guardarlo para correlación si querés)
        const stateResp = await requestBackend(base.generateStatePath, null, 'GET');
        const stateToken: string | undefined = stateResp?.state;
        if (!stateToken) throw new Error('No se pudo generar el state');
        stateTokenRef.current = stateToken;

        // 2) Construir auth URL final con state
        const finalAuthUrl = buildAuthUrl(base.clientId, base.redirectUri, stateToken);

        const can = await Linking.canOpenURL(finalAuthUrl);
        if (!can) throw new Error('No se pudo abrir el navegador del sistema');

        await Linking.openURL(finalAuthUrl);

        // Quedamos esperando el deep link de vuelta
        setStatus('waiting');
        return { ok: true };
      } catch (e: any) {
        const msg = e?.message ?? 'No se pudo abrir Mercado Pago';
        setStatus('error');
        setError(msg);
        return { ok: false, error: msg };
      }
    },
    []
  );

  // ---- Consultar estado en backend (con guard) ----
  const refreshStatus = useCallback(async (): Promise<MpLinkedInfo | null> => {
    // mutex: si ya hay una llamada en curso, no lanzar otra
    if (statusInFlightRef.current) return null;

    // debounce simple
    const now = Date.now();
    if (now - lastStatusAtRef.current < base.debounceMs) return null;

    statusInFlightRef.current = true;
    lastStatusAtRef.current = now;

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

      // si aún no está, mantenemos 'waiting'
      if (status !== 'opening') setStatus('waiting');
      return null;
    } catch (e: any) {
      const msg = e?.message ?? 'Error consultando estado de vinculación';
      setError(msg);
      setStatus('error');
      return null;
    } finally {
      statusInFlightRef.current = false;
    }
  }, []);

  /**
   * Llamala UNA SOLA VEZ cuando tu deep link "jex://oauth/mp?status=ok" abra la app.
   * Hace exactamente UN GET a /status con guardas anti-duplicación.
   * Si querés, podés pasar el "state" recibido en la query para validar con el generado.
   */
  const onReturnFromMp = useCallback(
    async (returnedState?: string) => {

      return await refreshStatus();
    },
    []
  );

  return {
    // estado
    status,
    error,
    info,
    busy,
    authUrl, // base (sin state), útil para debug

    // acciones
    openAuthorization,
    refreshStatus,   // queda por si querés botón "Ya autoricé"
    onReturnFromMp,  // <-- usá ESTA al volver por deep link (hace 1 sola llamada)
    loadLocal,
    clearLocal,
  };
}
