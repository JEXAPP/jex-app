import { useState } from 'react';
import axios, { Method } from 'axios';
import { config } from '@/config';
import * as SecureStore from 'expo-secure-store';

// Obtiene la URL base de la API desde la configuración de Expo
const apiBaseUrl = config.apiBaseUrl

// Define la estructura del resultado que devuelve el hook
interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  requestBackend: (endpoint: string, payload?: any, method?: Method, config?: object) => Promise<T | null>;
}

export default function useBackendConection<T = any>(): UseApiResult<T> {

  // Estado para guardar la respuesta del backend
  const [data, setData] = useState<T | null>(null);

  // Estado para guardar errores si ocurren
  const [error, setError] = useState<string | null>(null);

  // Estado para saber si se está esperando una respuesta
  const [loading, setLoading] = useState<boolean>(false);

  // Función principal para hacer una solicitud HTTP al backend
  const requestBackend = async (
    endpoint: string,               // Ruta del endpoint
    payload: any = {},             // Datos a enviar en la solicitud
    method: Method = 'POST',        // Método HTTP (por defecto GET)
    customConfig: object = {}      // Configuraciones adicionales para axios
  ): Promise<T | null> => {
    
    setLoading(true);              // Activa el indicador de carga
    setError(null);                // Limpia errores anteriores

    try {

      // Obtener Token
      const token = await SecureStore.getItemAsync('access');

      // Hace la solicitud al backend usando axios
      const response = await axios({
          url: `${apiBaseUrl}${endpoint}`,
          method,
          data: payload,
          headers: {
            ...(customConfig as any).headers,
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          ...customConfig,
      });

      setData(response.data);    // Guarda los datos recibidos
      return response.data;      // Devuelve los datos

    } catch (err: any) {

      // Si hay error, guarda el mensaje
      const mensaje = err?.response?.data?.message || 'Error en la comunicación con el servidor';
      setError(mensaje);
      return null;

    } finally {
      setLoading(false);           // Desactiva el indicador de carga
    }
  };

  return { data, error, loading, requestBackend };
}