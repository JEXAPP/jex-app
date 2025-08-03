import { useState, useEffect } from 'react';
import useBackendConection from '@/services/useBackendConection';
import { router, useLocalSearchParams } from 'expo-router';

export const useManipularVacante = () => {
  const [vacanteOculta, setVacanteOculta] = useState(false);
  const [mostrarAlertaOcultar, setMostrarAlertaOcultar] = useState(false);
  const [mostrarAlertaMostrar, setMostrarAlertaMostrar] = useState(false);
  const [mostrarAlertaEliminar, setMostrarAlertaEliminar] = useState(false);
  const [estadosVacante, setEstadosVacante] = useState<any[]>([]);

  const { requestBackend } = useBackendConection();


  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await requestBackend('/api/vacancy-states/', null, 'GET');
        setEstadosVacante(response || []);
        console.log('estados:', response);
      } catch (error) {
        console.error('Error al traer los estados de vacante:', error);
      }
    };

    fetchEstados();
  }, []);

  const cambiarEstadoVacante = async (vacanteId: number, nombreEstado: string) => {
    
    const estado = estadosVacante.find((e) => e.name.toLowerCase() === nombreEstado.toLowerCase());

    if (!estado) {
      console.error(`No se encontró el estado "${nombreEstado}"`);
      return;
    }

    try {
      const payload = { state_id: estado.id };

      await requestBackend(`/api/vacancies/${vacanteId}/state/`, payload, 'PATCH');
      console.log(`Vacante actualizada a estado "${estado.name}" (ID ${estado.id})`);

      // Estado local (solo controlamos si está oculta o no)
      if (estado.name === 'Oculta') setVacanteOculta(true);
      if (estado.name === 'Activa') setVacanteOculta(false);
      if (estado.name === 'Eliminada') {router.push('/'); } //cambiar la ruta!!!!!

    } catch (error) {
      console.error('Error al actualizar la vacante:', error);
    } finally {
      // Cierre de alertas
      setMostrarAlertaOcultar(false);
      setMostrarAlertaMostrar(false);
      setMostrarAlertaEliminar(false);
    }
  };

  return {
    vacanteOculta,
    setVacanteOculta,
    mostrarAlertaOcultar,
    setMostrarAlertaOcultar,
    mostrarAlertaMostrar,
    setMostrarAlertaMostrar,
    mostrarAlertaEliminar,
    setMostrarAlertaEliminar,
    cambiarEstadoVacante,
  };
};


