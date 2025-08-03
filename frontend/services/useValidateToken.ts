// hooks/auth/useVerificarToken.ts
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useValidateToken = () => {
  const router = useRouter();

  useEffect(() => {
    const verificar = async () => {
      const token = await SecureStore.getItemAsync('access');
      if (!token) {
        router.replace('/login'); // redirige a login si no hay token
      }
    };

    verificar();
  }, [router]);
};
