import { Method } from 'axios';
import { getApi } from './api';

type RequestConfig = Omit<
  Parameters<ReturnType<typeof getApi>['request']>[0],
  'url' | 'method' | 'data'
>;

function parseAxiosErrorData(err: any): any {
  const resp = err?.response;
  if (!resp) return { error: err?.message || 'Request failed' };

  // axios ya intenta parsear JSON en response.data
  let data = resp.data;

  // Si vino como Blob (pasa a veces), intentar leer texto y parsear
  if (data && typeof Blob !== 'undefined' && data instanceof Blob) {
    // NO podemos hacer await aquí porque no es async.
    // Devolvemos un objeto genérico; o podés volver async el parse.
    return { status: resp.status, error: 'Request failed' };
  }

  // Si es string, intentar parsear JSON; si no, dejar string como error
  if (typeof data === 'string') {
    try {
      const j = JSON.parse(data);
      data = j;
    } catch {
      data = { error: data };
    }
  }

  // Si no hay “error” ni “detail” y es un objeto con validaciones por campo, lo devolvemos igual
  if (typeof data !== 'object' || data === null) {
    return { status: resp.status, error: 'Request failed' };
  }

  return { status: resp.status, ...data };
}

export default function useBackendConection<T = any>() {
  const requestBackend = async (
    endpoint: string,
    payload: any = undefined,
    method: Method = 'GET',
    customConfig: RequestConfig = {}
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
    } catch (err: any) {
      // Normalizamos y re-lanzamos un objeto usable
      const normalized = parseAxiosErrorData(err);
      throw normalized;
    }
  };

  return { requestBackend };
}

export const getApiErrorMessage = (err: any): string => {
  if (!err) return 'Error desconocido';
  if (typeof err.error === 'string') return err.error;
  if (typeof err.detail === 'string') return err.detail;

  // DRF por campo: { start_date: ["..."], end_date: ["..."] }
  const firstKey = Object.keys(err).find(k => Array.isArray(err[k]) && typeof err[k][0] === 'string');
  if (firstKey) return err[firstKey][0];

  if (typeof err.message === 'string') return err.message;
  return 'No se pudo completar la operación.';
};
