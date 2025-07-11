import { useState } from 'react';
import { useRouter } from 'expo-router';

export const useSeleccionTipoUsuario = () => {
  const router = useRouter();

  // Estado para el tipo de usuario seleccionado
  const [selected, setSelected] = useState<string | null>(null);

  // Estado para controlar si hay un error por no seleccionar nada
  const [showError, setShowError] = useState(false);

  // Función que se ejecuta al presionar "Continuar".
  const handleContinue = () => {
    if (!selected) {
      setShowError(true);
      return;
    }

    if (selected === 'Empleado') {
      router.push('/registro/empleado');
    } else if (selected === 'Empleador') {
      router.push('/registro/empleador');
    }
  };

  return {
    selected,
    setSelected,
    showError,
    setShowError,
    handleContinue,
  };
};
