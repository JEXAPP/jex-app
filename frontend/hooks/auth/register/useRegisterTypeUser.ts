import { useState } from 'react';
import { useRouter } from 'expo-router';

export const useRegisterTypeUser = () => {
  const router = useRouter();

  // Estado que guarda la selección del usuario: 'Empleado' o 'Empleador'
  const [selected, setSelected] = useState<string | null>(null);

  // Lógica al presionar "Continuar", redirige según el tipo de usuario seleccionado
  const handleContinue = () => {
    if (selected === 'Empleado') {
      router.push('/auth/register/employee');
    } else {
      router.push('/auth/register/employer'); 
    }
  };

  // Habilita el botón de continuar solo si se seleccionó un tipo de usuario
  const continuarHabilitado =
    selected === 'Empleado' ? true : selected === 'Empleador';

  return {
    selected,
    setSelected,
    handleContinue,
    continuarHabilitado,
  };
};
