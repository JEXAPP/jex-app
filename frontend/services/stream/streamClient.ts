// services/external/streamClient.ts
import { StreamChat } from "stream-chat";
import {
  getStreamCredentials,
  StreamCredentials,
  RequestBackendFn,
} from "./streamApi";

let chatClient: StreamChat | null = null;
let connectedUserId: string | null = null;

/**
 * Conecta el usuario actual a Stream usando credenciales del backend.
 * Es idempotente y seguro: no rompe si ya había un usuario conectado.
 *
 * IMPORTANTE: recibe requestBackend (desde el hook useBackendConection).
 */
export async function connectStream(requestBackend: RequestBackendFn) {
  // 1) Pedimos credenciales al backend
  const { api_key, user, token }: StreamCredentials =
    await getStreamCredentials(requestBackend);

  // 2) Instancia singleton del cliente
  const client = StreamChat.getInstance(api_key);

  // 3) Detectamos si ya hay usuario conectado
  const currentUserId =
    (client as any).userID ??
    client.user?.id ??
    null;

  if (currentUserId) {
    if (currentUserId === user.id) {
      // Ya está conectado como este usuario → no reconectar
      chatClient = client;
      connectedUserId = user.id;
      return { client, user, api_key, token };
    }

    // Estaba conectado con OTRO usuario → desconectar primero
    try {
      await client.disconnectUser();
    } catch (e) {
        console.warn("Error al desconectar usuario previo de Stream:", e);
    }
  }

  // 4) Conectar el nuevo usuario
  await client.connectUser({ id: user.id }, token);

  // 5) Guardar referencias
  chatClient = client;
  connectedUserId = user.id;

  return { client, user, api_key, token };
}

/**
 * Desconecta el usuario actual de Stream.
 * Siempre limpia referencias aunque falle la desconexión.
 */
export async function disconnectStream() {
  if (!chatClient) return;

  try {
    await chatClient.disconnectUser();
  } catch (e) {
    console.warn("Error al desconectar usuario de Stream:", e);
  } finally {
    chatClient = null;
    connectedUserId = null;
  }
}

/**
 * Obtiene el cliente existente (ya conectado).
 */
export function getStreamClient(): StreamChat {
  if (!chatClient) {
    throw new Error("Stream no está conectado (llamá connectStream primero).");
  }
  return chatClient;
}

/**
 * Devuelve el ID del usuario actualmente conectado.
 */
export function getConnectedUserId(): string | null {
  return connectedUserId;
}
