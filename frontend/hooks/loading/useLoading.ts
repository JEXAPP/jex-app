import { useValidateToken } from '@/services/useValidateToken';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useLoading = () => {
  const router = useRouter();

  useValidateToken(); // <- Verifica token antes de continuar

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('./create-vacant');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);
};
