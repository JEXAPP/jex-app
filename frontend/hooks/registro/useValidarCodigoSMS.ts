// hooks/registro/useValidarCodigoSMS.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useValidarCodigoSMS() {
  const [codigo, setCodigo] = useState('');
  const router = useRouter();
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Nuevo estado para controlar el modal de éxito
  const [showSuccess, setShowSuccess] = useState(false);


  const handleValidar = () => {
    if (codigo.trim().length > 0) {
      router.push('/registro/mail-clave'); // Usa ruta absoluta
    } else {
      alert('Por favor ingrese un código válido.');
    }
  };
  useEffect(() => {
    const habilitado = codigo.trim().length >= 5;
    setContinuarHabilitado(habilitado);
  }, [codigo]);
    

  const closeError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  // Nuevo método para cerrar modal éxito (si querés cerrarlo manualmente)
  const closeSuccess = () => {
    setShowSuccess(false);
  };


  return {
    codigo,
    setCodigo,
    handleValidar,
    continuarHabilitado,
    showError,
    errorMessage,
    closeError,
    showSuccess,      
    closeSuccess 
  };
}
