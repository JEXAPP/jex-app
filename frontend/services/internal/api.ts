import axios, {AxiosError,AxiosInstance,AxiosRequestConfig,AxiosRequestHeaders,} from 'axios';
import { config } from '@/config';
import { router } from 'expo-router';
import {getToken as getStoredToken,setToken as setStoredToken,deleteToken as deleteStoredToken,} from '@/services/internal/useTokenStorage';
export { clearTokens };


let api: AxiosInstance | null = null;
let refreshPromise: Promise<string | null> | null = null;

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
  headers: AxiosRequestHeaders | any | undefined,
  token: string
): AxiosRequestHeaders | any {
  if (!headers) return { Authorization: `Bearer ${token}` };

  if (typeof (headers as any).set === 'function') {
    (headers as any).set('Authorization', `Bearer ${token}`);
    return headers;
  }

  return {
    ...(headers as any),
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

      // soporte para ambas variantes
      const newAccess = r.data?.access || r.data?.access_token;
      const newRefresh = r.data?.refresh || r.data?.refresh_token;

      if (!newAccess) return null;

      await setTokens(newAccess, newRefresh);

      // muy importante: que lo siguiente ya salga con el token nuevo
      if (api) {
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      }

      return newAccess;
    } catch (err) {
      console.log('[REFRESH ERROR]', err);
      await clearTokens();
      router.replace('/'); // vuelve al login si falla el refresh
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

  // Inserta el access en cada request
  api.interceptors.request.use(async (cfg) => {
    const token = await getAccess();
    if (token) {
      if ((cfg.headers as any)?.set) {
        (cfg.headers as any).set('Authorization', `Bearer ${token}`);
      } else {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    } else {
      console.log('[API] No token found (web/localStorage o nativo/SecureStore)');
    }
    return cfg;
  });

  // Maneja el refresh si da 401
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & {
        _retry?: boolean;
      }) | undefined;

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        const newAccess = await doRefresh();

        if (newAccess) {
          // Actualizo headers globales y de la request original
          api!.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          original.headers = withAuthHeader(original.headers, newAccess);

  // 👇 Usamos el helper para que SIEMPRE se setee el header bien
  original.headers = withAuthHeader(original.headers, newAccess);

  

  console.log('[RETRYING WITH TOKEN]', newAccess.slice(0, 20) + '...');
  console.log('[HEADERS]', original.headers);
  return api!.request(original);
}
      }

      throw error;
    }
  );

  return api;
}
