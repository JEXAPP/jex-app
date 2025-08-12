import axios, {AxiosError,AxiosInstance,AxiosRequestConfig,AxiosRequestHeaders,} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from '@/config';

let api: AxiosInstance | null = null;
let refreshPromise: Promise<string | null> | null = null;

async function getAccess() {
  return SecureStore.getItemAsync('access');
}

async function getRefresh() {
  return SecureStore.getItemAsync('refresh');
}

async function setAccess(token: string) {
  await SecureStore.setItemAsync('access', token);
}

async function clearTokens() {
  await SecureStore.deleteItemAsync('access');
  await SecureStore.deleteItemAsync('refresh');
}

function withAuthHeader(
  headers: AxiosRequestHeaders | any | undefined,
  token: string
): AxiosRequestHeaders | any {
  if (!headers) return { Authorization: `Bearer ${token}` };

  if (typeof headers.set === 'function') {
    headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  return {
    ...(headers as any),
    Authorization: `Bearer ${token}`,
  };
}

async function doRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = await getRefresh();
    if (!refresh) return null;

    try {
      const r = await axios.post(
        `${config.apiBaseUrl}/api/auth/login/jwt/refresh/`,
        { refresh }
      );
      const newAccess = r.data?.access;
      if (!newAccess) return null;
      await setAccess(newAccess);
      return newAccess;
    } catch {
      await clearTokens();
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
    timeout: 10000,
  });

  // Log de requests
  api.interceptors.request.use(async (cfg) => {
    const token = await getAccess();
    if (token) {
      cfg.headers = withAuthHeader(cfg.headers as any, token);
    }

    return cfg;
  });

  // Log de respuestas y manejo de refresh
  api.interceptors.response.use(
    (res) => {
      if (res.data) {
      }
      return res;
    },
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (error.response) {
        console.log('[API ERROR]', error.response.status, error.response.config?.url);
        if (error.response?.status !== 500 && error.response?.data) {
          console.log('Error Response Data:', error.response.data);
        }
      } else {
        console.log('[API ERROR]', error.message);
      }

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;
        const newAccess = await doRefresh();
        if (newAccess) {
          original.headers = withAuthHeader(original.headers as any, newAccess);
          return api!.request(original);
        }
      }

      throw error;
    }
  );

  return api;
}
