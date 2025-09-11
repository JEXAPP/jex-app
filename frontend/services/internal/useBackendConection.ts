import { Method } from 'axios';
import { getApi } from './api';

type RequestConfig = Omit<
  Parameters<ReturnType<typeof getApi>['request']>[0],
  'url' | 'method' | 'data'
>;

export default function useBackendConection<T = any>() {
  const requestBackend = async (
    endpoint: string,
    payload: any = undefined,
    method: Method = 'GET',
    customConfig: RequestConfig = {}
  ): Promise<T> => {
    const api = getApi();
    const res = await api.request<T>({
      url: endpoint,
      method,
      data: payload,
      ...customConfig,
    });
    return res.data;
  };

  return { requestBackend };
}
