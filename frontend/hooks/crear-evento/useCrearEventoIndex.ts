import { useVerificarToken } from '@/services/useVerificarToken';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useCrearEventoIndex = () => {
  const router = useRouter();

  useVerificarToken(); // <- Verifica token antes de continuar

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('./crear-evento');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);
};
