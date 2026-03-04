// services/external/streamApi.ts

export type StreamCredentials = {
  api_key: string;
  user: {
    id: string;
    name: string;
    image?: string;
    role?: string;
  };
  token: string;
};

// La hacemos compatible con tu requestBackend real
export type RequestBackendFn = (
  endpoint: string,
  payload?: any,
  method?: any,
  customConfig?: any
) => Promise<StreamCredentials>;

/**
 * Pide al backend las credenciales para conectarse a Stream.
 * NO usa hooks. Recibe requestBackend como parámetro.
 */
export async function getStreamCredentials(
  requestBackend: RequestBackendFn
): Promise<StreamCredentials> {
  const url = "/api/chats/stream/token/";

  const response = await requestBackend(url, null, "GET");

  if (response?.user?.id) {
    response.user.id = String(response.user.id);
  }

  return response;
}
