import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

export const useRegisterTypeUser = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const desdeGoogle = params.google === '1';

  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    const base = new URLSearchParams({ ...params as Record<string, string> }).toString();
    if (selected === 'Empleado') router.push(`/auth/register/employee?${base}`);
    else router.push(`/auth/register/employer?${base}`);
  };

  const continuarHabilitado = selected === 'Empleado' ? true : selected === 'Empleador';

  return { selected, setSelected, handleContinue, continuarHabilitado, desdeGoogle };
};
