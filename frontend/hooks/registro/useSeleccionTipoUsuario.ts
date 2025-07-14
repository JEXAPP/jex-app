import { useState } from 'react';
import { useRouter } from 'expo-router';

export const useSeleccionTipoUsuario = () => {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {

    if (selected === 'Empleado') {
      router.push('/registro/empleado');
    } else {
      router.push('/registro/empleador');
    }
  };

  const continuarHabilitado =
    selected === 'Empleado' ? true : selected === 'Empleador';

  return {
    selected,
    setSelected,
    handleContinue,
    continuarHabilitado,
  };
};
