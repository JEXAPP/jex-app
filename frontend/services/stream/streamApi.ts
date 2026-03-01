// services/external/streamApi.ts
import useBackendConection from '@/services/internal/useBackendConection';

export type StreamCredentials = {
  api_key: string;
  user_id: string;
  token: string;
};

// Pide al backend las credenciales para conectarse a Stream.
// Devuelve: { api_key, user_id, token }
export async function getStreamCredentials(): Promise<StreamCredentials> {
  const url = '/api/chats/stream/token/';
  const { requestBackend } = useBackendConection<StreamCredentials>();

  const response = await requestBackend(url, null, 'GET');

  // Sanity check mínimo (opcional)
  if (!response?.api_key || !response?.user_id || !response?.token) {
    throw new Error('Credenciales de Stream inválidas desde el backend.');
  }

  return response;
}
