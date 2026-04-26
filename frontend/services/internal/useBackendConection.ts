import { Method } from 'axios';
import { getApi } from './api';

type RequestConfig = Omit<
  Parameters<ReturnType<typeof getApi>['request']>[0],
  'url' | 'method' | 'data'
>;

// SECURITY: Internal error shape — never exposed directly to the UI.
interface NormalizedError {
  status?: number;
  error?: string;
  detail?: string;
  retryAfter?: number;
  [key: string]: unknown;
}

function parseAxiosErrorData(err: unknown): NormalizedError {
  // SECURITY: 429 errors are pre-normalized in the api.ts interceptor
  if (
    err !== null &&
    typeof err === 'object' &&
    (err as NormalizedError).status === 429
  ) {
    return err as NormalizedError;
  }

  const axiosErr = err as { response?: { status?: number; data?: unknown }; message?: string } | null;
  const resp = axiosErr?.response;
  if (!resp) return { error: axiosErr?.message || 'Error de conexión' };

  let data = resp.data;

  if (data && typeof Blob !== 'undefined' && data instanceof Blob) {
    return { status: resp.status, error: 'No se pudo completar la operación.' };
  }

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      // SECURITY: Don't expose raw server strings to the UI
      data = { error: 'No se pudo completar la operación.' };
    }
  }

  if (typeof data !== 'object' || data === null) {
    return { status: resp.status, error: 'No se pudo completar la operación.' };
  }

  return { status: resp.status, ...(data as Record<string, unknown>) };
}

export default function useBackendConection<T = unknown>() {
  const requestBackend = async (
    endpoint: string,
    payload: unknown = undefined,
    method: Method = 'GET',
    customConfig: RequestConfig & { useAuth?: boolean } = {}
  ): Promise<T> => {
    const api = getApi();
    try {
      const res = await api.request<T>({
        url: endpoint,
        method,
        data: payload,
        ...customConfig,
      });
      return res.data;
    } catch (err: unknown) {
      const normalized = parseAxiosErrorData(err);
      throw normalized;
    }
  };

  return { requestBackend };
}

// SECURITY: Maps internal error objects to Spanish user-facing strings.
// Raw server messages and stack traces are never forwarded to the UI.
export const getApiErrorMessage = (err: unknown): string => {
  if (!err) return 'Error desconocido';
  const e = err as NormalizedError;

  // SECURITY: Rate-limit message — always user-friendly
  if (e.status === 429 && typeof e.error === 'string') return e.error;

  if (typeof e.error === 'string') return e.error;
  if (typeof e.detail === 'string') return e.detail;

  // DRF field-level errors: { start_date: [“...”], end_date: [“...”] }
  const firstKey = Object.keys(e).find(
    k => Array.isArray(e[k]) && typeof (e[k] as unknown[])[0] === 'string'
  );
  if (firstKey) return (e[firstKey] as string[])[0];

  return 'No se pudo completar la operación.';
};
