import { useState } from 'react';
import { useRouter } from 'expo-router';


export const useCreateEvent = () => {
  const router = useRouter();

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [fechaInicioEvento, setFechaInicioEvento] = useState<Date | null>(null);
  const [fechaFinEvento, setFechaFinEvento] = useState<Date | null>(null);
  const [ubicacionEvento, setUbicacionEvento] = useState('');


  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  //#region Validación de campos
  const validarCampos = () => {
  if (!nombreEvento || !descripcionEvento || !fechaInicioEvento || !fechaFinEvento || !ubicacionEvento) {
    setErrorMessage('Todos los campos son obligatorios');
    setShowError(true);
    return false;
  }
  //#endregion

  //#region Validación de fechas
  if (new Date(fechaInicioEvento) >= new Date(fechaFinEvento)) {
    setErrorMessage('La fecha de inicio debe ser anterior a la fecha de fin');
    setShowError(true);
    return false;
    }
    //#endregion

  return true;
};

    const closeSuccess = () => {
    setShowSuccess(false);
    router.push('/'); // Redirige a la pantalla principal
    };

    const closeError = () => {
    setShowError(false);
    setErrorMessage('');
    };
    const handleCrearEvento = () => {
  if (!validarCampos()) return;

  // Acá podés enviar los datos al backend o guardarlos temporalmente
  setShowSuccess(true);
};

  return {
    nombreEvento,
    descripcionEvento,
    fechaInicioEvento,
    fechaFinEvento,
    ubicacionEvento,
    setNombreEvento,
    setDescripcionEvento,
    setFechaInicioEvento,
    setFechaFinEvento,
    setUbicacionEvento,
    handleCrearEvento,
    showError,
    errorMessage,
    showSuccess,
    closeError,
    closeSuccess
  };
};
