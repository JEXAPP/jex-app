import useBackendConection from "@/services/internal/useBackendConection";

export type StreamCredentials = {
  api_key: string;
  user_id: string;
  token: string;
};

//Pide al backend las credenciales para conectarse a Stream.
//El backend devuelve: { api_key, user_id, token }

export async function getStreamCredentials() {
  const url = "/api/chats/stream/token/";
  const { requestBackend } = useBackendConection<StreamCredentials>();

  const response = await requestBackend(url, null, "GET");

  return response; 
  // esperado: { api_key, user_id, token }
}
