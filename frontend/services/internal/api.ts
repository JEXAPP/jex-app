import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { config } from '@/config';
import { router } from 'expo-router';
import {
  getToken as getStoredToken,
  setToken as setStoredToken,
  deleteToken as deleteStoredToken,
} from '@/services/internal/useTokenStorage';
import { logger } from '@/services/internal/logger';
export { clearTokens };

let api: AxiosInstance | null = null;
let refreshPromise: Promise<string | null> | null = null;

// SECURITY: Tracks until when the client is rate-limited (ms epoch).
// Requests are blocked locally to respect the server's Retry-After header.
let rateLimitedUntil: number | null = null;

async function getAccess() {
  return getStoredToken('access');
}

async function getRefresh() {
  return getStoredToken('refresh');
}

async function setTokens(access: string, refresh?: string) {
  await setStoredToken('access', access);
  if (refresh) await setStoredToken('refresh', refresh);
}

async function clearTokens() {
  await deleteStoredToken('access');
  await deleteStoredToken('refresh');
}

function withAuthHeader(
  headers: AxiosRequestHeaders | Record<string, unknown> | undefined,
  token: string
): Record<string, unknown> {
  if (!headers) return { Authorization: `Bearer ${token}` };

  if (typeof (headers as Record<string, unknown>).set === 'function') {
    (headers as { set: (k: string, v: string) => void }).set('Authorization', `Bearer ${token}`);
    return headers as Record<string, unknown>;
  }

  return {
    ...(headers as Record<string, unknown>),
    Authorization: `Bearer ${token}`,
  };
}

export async function doRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = await getRefresh();
    if (!refresh) return null;

    try {
      const r = await axios.post(
        `${config.apiBaseUrl}api/auth/login/jwt/refresh/`,
        { refresh }
      );

      const newAccess = r.data?.access || r.data?.access_token;
      // SECURITY: Rotate the refresh token on every use to limit replay window.
      const newRefresh = r.data?.refresh || r.data?.refresh_token;

      if (!newAccess) return null;

      await setTokens(newAccess, newRefresh);

      if (api) {
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      }

      return newAccess;
    } catch (err) {
      // SECURITY: Use safe logger — never print raw tokens or response bodies
      logger.error('[REFRESH ERROR]', err);
      await clearTokens();
      router.replace('/');
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function getApi(): AxiosInstance {
  if (api) return api;

  api = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 100000,
  });

  // SECURITY: Attach Bearer token to every authenticated request.
  api.interceptors.request.use(async (cfg) => {
    if ((cfg as AxiosRequestConfig & { useAuth?: boolean }).useAuth === false) {
      if (cfg.headers) delete (cfg.headers as Record<string, unknown>).Authorization;
      return cfg;
    }

    // SECURITY: Block the request locally while rate-limited to respect Retry-After
    if (rateLimitedUntil !== null && Date.now() < rateLimitedUntil) {
      const seconds = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
      return Promise.reject({
        status: 429,
        error: `Demasiadas solicitudes. Por favor, esperá ${seconds} segundos antes de intentar de nuevo.`,
        retryAfter: seconds,
      });
    }

    const token = await getAccess();
    if (token) {
      if (typeof (cfg.headers as Record<string, unknown>)?.set === 'function') {
        (cfg.headers as { set: (k: string, v: string) => void }).set(
          'Authorization',
          `Bearer ${token}`
        );
      } else {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
    } else {
      logger.warn('[API] No access token found; request will be unauthenticated');
    }
    return cfg;
  });

  // SECURITY: Handle 401 via token refresh and 429 via Retry-After.
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

      // SECURITY: 429 – respect Retry-After and surface a user-friendly message
      if (error.response?.status === 429) {
        const retryAfterHeader = (error.response.headers as Record<string, string>)['retry-after'];
        const seconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
        rateLimitedUntil = Date.now() + seconds * 1000;
        throw {
          status: 429,
          error: `Demasiadas solicitudes. Por favor, esperá ${seconds} segundos antes de intentar de nuevo.`,
          retryAfter: seconds,
        };
      }

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        const newAccess = await doRefresh();

        if (newAccess) {
          api!.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          original.headers = withAuthHeader(original.headers, newAccess);
          // SECURITY: Log only the fact of the retry, never the token value
          logger.log('[API] Retrying request after token refresh');
          return api!.request(original);
        }
      }

      throw error;
    }
  );

  return api;
}
