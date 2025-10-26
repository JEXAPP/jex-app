import useBackendConection from '@/services/internal/useBackendConection';
import { useTokenValidations } from '@/services/internal/useTokenValidations';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type Interest = { id: number; name: string };

export const useStepFour = () => {
  
  const router = useRouter();
  const { requestBackend } = useBackendConection();
  const { validateToken } = useTokenValidations();
  const [loading, setLoading] = useState(false);
  const [intereses, setIntereses] = useState<Interest[]>([]);
  const [interesesSeleccionados, setInteresesSeleccionados] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        await validateToken('employee');
        const data = await requestBackend('/api/vacancies/job-types/', null, 'GET');
        if (alive && data) setIntereses(data);
      } catch (e) {
        setErrorMessage('No pudimos cargar los intereses. Intentá nuevamente.');
        setShowError(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleToggleIntereses = (id: number) => {
    const ya = interesesSeleccionados.includes(id);
    if (ya) {
      setInteresesSeleccionados(prev => prev.filter(x => x !== id));
    } else {
      if (interesesSeleccionados.length >= 3) {
        setErrorMessage('Solo podés seleccionar hasta 3 intereses.');
        setShowError(true);
        return;
      }
      setInteresesSeleccionados(prev => [...prev, id]);
    }
  };

  const omitir = () => router.replace('/employee');

  const siguiente = async () => {
    // Enviar solo job_types aquí (Step 1 ya guardó foto/descr.)
    const payload = { job_types: interesesSeleccionados };

    setLoading(true);
    try {
      await requestBackend('/api/auth/employee/interests/', payload, 'PUT');
      setTimeout(() => {
        router.replace('/employee');
      }, 1100);
    } catch (e) {
      setErrorMessage('Ocurrió un error al guardar tus intereses.');
      setShowError(true);
    } finally {
      setLoading(false);
    }

    // Si querés cambiar el endpoint, dejé el objeto listo:
    // await requestBackend('/reemplazar', payload, 'PUT');
  };

  const closeError = () => setShowError(false);

  return {
    omitir, siguiente,
    intereses, interesesSeleccionados, handleToggleIntereses,
    loading,
    showError, errorMessage, closeError,
  };
};
