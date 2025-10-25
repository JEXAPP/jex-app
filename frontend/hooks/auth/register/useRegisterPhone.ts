import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useBackendConection from '@/services/internal/useBackendConection';
import { useDataValidation } from '@/services/internal/useDataValidation';

export const useRegisterPhone = () => {
  const router = useRouter();
  const { google, gAt, gCode } = useLocalSearchParams<{ google?: string; gAt?: string; gCode?: string }>();
  const desdeGoogle = google === '1';
  const { requestBackend } = useBackendConection();
  const { validateCodeArea } = useDataValidation();

  const [loading, setLoading] = useState(false);
  const [codigoArea, setCodigoArea] = useState('');
  const [telefono, setTelefono] = useState('');
  const [continuarHabilitado, setContinuarHabilitado] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/[^0-9]/g, '');
    if (limpio.length <= 7) {
      const conGuion = limpio.length > 3 ? limpio.slice(0, 3) + '-' + limpio.slice(3) : limpio;
      setTelefono(conGuion);
    }
  };

  const normalizarCodigo = (codigo: string) => codigo.replace(/^0+/, '');

  const handleContinue = async () => {
    const telefonoLimpio = telefono.replace('-', '');
    const codigoNormalizado = normalizarCodigo(codigoArea);

    if (!codigoArea) { setErrorMessage('Debés ingresar un código de área'); setShowError(true); return; }
    if (!validateCodeArea(codigoNormalizado)) { setErrorMessage('Código de Área no válido'); setShowError(true); return; }
    if (telefonoLimpio.length < 7) { setErrorMessage('El número de teléfono debe tener al menos 7 dígitos'); setShowError(true); return; }

    setLoading(true);
    try {
      const phone = `+54${codigoNormalizado}${telefonoLimpio}`;
      await requestBackend('/api/auth/verify/send-code/', { phone }, 'POST');

      const qs = new URLSearchParams({
        phone,
        google: desdeGoogle ? '1' : '0',
        ...(gAt ? { gAt } : {}),
        ...(gCode ? { gCode } : {}),
      }).toString();

      router.push(`/auth/register/code-validation?${qs}`);
    } catch (error: any) {
      setErrorMessage(error?.error || 'Ocurrió un error inesperado');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const telefonoLimpio = telefono.replace('-', '');
    setContinuarHabilitado(codigoArea.length > 0 && telefonoLimpio.length >= 7);
  }, [codigoArea, telefono]);

  const closeError = () => { setErrorMessage(''); setShowError(false); };
  const closeSuccess = () => setShowSuccess(false);

  return {
    codigoArea, setCodigoArea,
    telefono, setTelefono: handleTelefonoChange,
    desdeGoogle,
    continuarHabilitado,
    handleContinue,
    showError, errorMessage, closeError,
    showSuccess, closeSuccess,
    loading,
  };
};
