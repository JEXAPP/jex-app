// services/external/streamClient.ts
import { StreamChat } from 'stream-chat';
import { getStreamCredentials, type StreamCredentials } from './streamApi';

let chatClient: StreamChat | null = null;
let connectedUserId: string | null = null;

/**
 * Conecta el usuario actual a Stream usando credenciales del backend.
 * Llamala justo después del login exitoso.
 *
 * @returns { client, user_id, api_key, token }
 */
export async function connectStream() {
  // 1) Pedimos credenciales al backend
  const { api_key, user_id, token }: StreamCredentials = await getStreamCredentials();

  // 2) Creamos/obtenemos instancia singleton de Stream
  //    (La instancia se cachea por api_key)
  const client = StreamChat.getInstance(api_key);

  // 3) Si ya hay alguien conectado:
  if (connectedUserId) {
    if (connectedUserId === user_id) {
      // Ya estamos conectados con el mismo user → devolvemos
      chatClient = client;
      return { client, user_id, api_key, token };
    }
    // Hay otro user conectado → desconectar antes
    try { await client.disconnectUser(); } catch {}
    connectedUserId = null;
  }

  // 4) Conectar al usuario actual
  await client.connectUser({ id: user_id }, token);

  // 5) Guardar referencias
  chatClient = client;
  connectedUserId = user_id;

  return { client, user_id, api_key, token };
}

/**
 * Desconecta el usuario de Stream. Llamala en logout.
 */
export async function disconnectStream() {
  if (chatClient) {
    try { await chatClient.disconnectUser(); } finally {
      chatClient = null;
      connectedUserId = null;
    }
  }
}

/**
 * Devuelve el cliente ya conectado. Si no está, lanza error.
 */
export function getStreamClient(): StreamChat {
  if (!chatClient) {
    throw new Error('Stream no está conectado (llamá connectStream primero).');
  }
  return chatClient;
}

/**
 * Devuelve el id del usuario conectado a Stream (útil para filtros).
 */
export function getConnectedUserId(): string | null {
  return connectedUserId;
}
